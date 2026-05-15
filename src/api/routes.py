from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, Inscription  # <--- Añadido Inscription aquí
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)
CORS(api)


@api.route('/register', methods=['POST'])
def handle_register():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Cuerpo del mensaje vacío"}), 400

    email = body.get("email")
    password = body.get("password")
    role = body.get("role", "runner")

    if not email or not password:
        return jsonify({"msg": "Email y password son obligatorios"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya está registrado"}), 400

    new_user = User(email=email, password=password, role=role, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": f"Usuario creado con éxito como {role}"}), 201


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity=str(
        user.id), additional_claims={"role": user.role})
    return jsonify({"token": access_token, "user": user.serialize()}), 200


@api.route('/profile', methods=['GET'])
@jwt_required()
def handle_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.serialize()), 200


@api.route('/event', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role != "organizer":
        return jsonify({"msg": "Permisos insuficientes. Debes ser organizador."}), 403

    body = request.get_json()
    required_fields = ['title', 'date',
                       'location_name', 'latitude', 'longitude']
    for field in required_fields:
        if field not in body or body[field] is None:
            return jsonify({"msg": f"Falta el campo obligatorio: {field}"}), 400

    try:
        new_event = Event(
            title=body['title'],
            description=body.get('description', ""),
            date=body['date'],
            location_name=body['location_name'],
            latitude=body['latitude'],
            longitude=body['longitude'],
            organizer_id=current_user_id
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"msg": "Evento creado con éxito", "event": new_event.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route('/events', methods=['GET'])
def get_all_events():
    all_events = Event.query.all()
    results = [event.serialize() for event in all_events]
    return jsonify(results), 200


@api.route('/event/<int:event_id>', methods=['GET'])
def get_single_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"msg": "Evento no encontrado"}), 404
    return jsonify(event.serialize()), 200


@api.route('/event/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    current_user_id = get_jwt_identity()
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"msg": "Evento no encontrado"}), 404

    if event.organizer_id != int(current_user_id):
        return jsonify({"msg": "No tienes permiso para editar este evento"}), 403

    body = request.get_json()
    if 'title' in body:
        event.title = body['title']
    if 'description' in body:
        event.description = body['description']
    if 'date' in body:
        event.date = body['date']
    if 'location_name' in body:
        event.location_name = body['location_name']
    if 'latitude' in body:
        event.latitude = body['latitude']
    if 'longitude' in body:
        event.longitude = body['longitude']

    db.session.commit()
    return jsonify({"msg": "Evento actualizado correctamente", "event": event.serialize()}), 200


@api.route('/event/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user_id = get_jwt_identity()
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"msg": "Evento no encontrado"}), 404

    if event.organizer_id != int(current_user_id):
        return jsonify({"msg": "No tienes permiso para borrar este evento"}), 403

    db.session.delete(event)
    db.session.commit()
    return jsonify({"msg": "Evento eliminado correctamente"}), 200


@api.route('/subscribe', methods=['POST'])
@jwt_required()
def subscribe_to_event():
    current_user_id = get_jwt_identity()
    body = request.get_json()
    event_id = body.get("event_id")

    if not event_id:
        return jsonify({"msg": "Falta el ID del evento"}), 400

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"msg": "El evento no existe"}), 404

    already_subscribed = Inscription.query.filter_by(
        user_id=current_user_id,
        event_id=event_id
    ).first()

    if already_subscribed:
        return jsonify({"msg": "Ya estás inscrito en esta carrera"}), 400

    try:
        new_inscription = Inscription(
            user_id=current_user_id,
            event_id=event_id
        )
        db.session.add(new_inscription)
        db.session.commit()
        return jsonify({"msg": "Inscripción completada con éxito"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al procesar la inscripción", "error": str(e)}), 500


@api.route('/unsubscribe/<int:event_id>', methods=['DELETE'])
@jwt_required()
def unsubscribe(event_id):
    current_user_id = get_jwt_identity()

    inscription = Inscription.query.filter_by(
        user_id=current_user_id,
        event_id=event_id
    ).first()

    if not inscription:
        return jsonify({"msg": "No estás inscrito en este evento"}), 404

    db.session.delete(inscription)
    db.session.commit()
    return jsonify({"msg": "Inscripción cancelada correctamente"}), 200


@api.route('/my-inscriptions', methods=['GET'])
@jwt_required()
def get_my_inscriptions():
    current_user_id = get_jwt_identity()

    user_inscriptions = Inscription.query.filter_by(
        user_id=current_user_id).all()

    return jsonify([ins.serialize() for ins in user_inscriptions]), 200
