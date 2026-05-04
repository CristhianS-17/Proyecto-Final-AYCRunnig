from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event
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

    new_user = User(
        email=email,
        password=password,
        role=role,
        is_active=True
    )

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

    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200


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
        return jsonify({"msg": "Acceso denegado. Solo organizadores pueden crear eventos"}), 403

    body = request.get_json()

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


@api.route('/events', methods=['GET'])
def get_all_events():

    all_events = Event.query.all()

    results = [event.serialize() for event in all_events]

    return jsonify(results), 200
