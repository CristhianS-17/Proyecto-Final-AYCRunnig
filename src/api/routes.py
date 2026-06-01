from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, Inscription
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)
CORS(api, resources={r"/*": {"origins": "*"}})

# --- RUTAS DE AUTENTICACIÓN Y PERFIL ---


@api.route('/register', methods=['POST'])
def handle_register():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Cuerpo vacío"}), 400
    email = body.get("email")
    password = body.get("password")
    role = body.get("role", "runner")
    if not email or not password:
        return jsonify({"msg": "Email y password obligatorios"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Usuario ya existe"}), 400
    try:
        new_user = User(
            email=email, password=generate_password_hash(password), role=role,
            is_active=True, first_name=body.get("first_name"),
            last_name=body.get("last_name"), gender=body.get("gender"),
            residence=body.get("residence"), profile_picture="https://placeholder.co/150"
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error", "error": str(e)}), 500


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user = User.query.filter_by(email=body.get("email")).first()
    if user is None or not check_password_hash(user.password, body.get("password")):
        return jsonify({"msg": "Credenciales incorrectas"}), 401
    token = create_access_token(identity=str(
        user.id), additional_claims={"role": user.role})
    return jsonify({"token": token, "user": user.serialize()}), 200


@api.route('/profile', methods=['GET'])
@jwt_required()
def handle_profile():
    user = User.query.get(get_jwt_identity())
    return jsonify(user.serialize()) if user else (jsonify({"msg": "No encontrado"}), 404)


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    body = request.get_json()
    if "first_name" in body:
        user.first_name = body["first_name"]
    if "last_name" in body:
        user.last_name = body["last_name"]
    if "gender" in body:
        user.gender = body["gender"]
    if "residence" in body:
        user.residence = body["residence"]
    if "peso" in body:
        user.peso = body["peso"]
    if "altura" in body:
        user.altura = body["altura"]
    try:
        db.session.commit()
        return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar", "error": str(e)}), 500


@api.route('/upload-avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user = User.query.get(get_jwt_identity())
    if 'avatar' not in request.files:
        return jsonify({"msg": "No hay archivo"}), 400
    user.profile_picture = request.files['avatar'].filename
    db.session.commit()
    return jsonify({"msg": "Avatar actualizado"}), 200


# RUTAS DE EVENTOS (CRUD)


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
            start_time=body.get('start_time'),
            end_time=body.get('end_time'),
            registration_deadline=body.get('registration_deadline'),
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
    fields_to_update = [
        'title',
        'description',
        'date',
        'location_name',
        'latitude',
        'longitude',
        'start_time',
        'end_time',
        'registration_deadline'
    ]
    for field in fields_to_update:
        if field in body:
            setattr(event, field, body[field])

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

    Inscription.query.filter_by(event_id=event_id).delete()

    db.session.delete(event)
    db.session.commit()

    return jsonify({"msg": "Evento eliminado correctamente"}), 200

# RUTAS DE INSCRIPCIONES (MANY-TO-MANY)


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
            user_id=current_user_id, event_id=event_id)
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
        user_id=current_user_id, event_id=event_id).first()

    if not inscription:
        return jsonify({"msg": "No estás inscrito en este evento"}), 404

    db.session.delete(inscription)
    db.session.commit()
    return jsonify({"msg": "Inscripción cancelada correctamente"}), 200


@api.route('/event/<int:event_id>/participant/<int:user_id>', methods=['DELETE'])
@jwt_required()
def remove_participant(event_id, user_id):

    current_user_id = get_jwt_identity()

    event = Event.query.get(event_id)

    if not event:
        return jsonify({"msg": "Evento no encontrado"}), 404

    if event.organizer_id != int(current_user_id):
        return jsonify({"msg": "No tienes permiso"}), 403

    inscription = Inscription.query.filter_by(
        user_id=user_id,
        event_id=event_id
    ).first()

    if not inscription:
        return jsonify({"msg": "Participante no encontrado"}), 404

    db.session.delete(inscription)
    db.session.commit()

    return jsonify({"msg": "Participante eliminado"}), 200


@api.route('/my-inscriptions', methods=['GET'])
@jwt_required()
def get_my_inscriptions():
    current_user_id = get_jwt_identity()
    user_inscriptions = Inscription.query.filter_by(
        user_id=current_user_id).all()
    return jsonify([ins.serialize() for ins in user_inscriptions]), 200


@api.route('/forgot-password', methods=['POST'])
def handle_forgot_password():
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Faltan datos"}), 400

    email = body.get("email")
    if not email:
        return jsonify({"msg": "El email es obligatorio"}), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"msg": "Si el correo existe, recibirás un enlace para restablecer tu contraseña."}), 200

    recovery_token = create_access_token(
        identity=str(user.id),
        additional_claims={"purpose": "password_recovery"}
    )

    frontend_url = f"/reset-password?token={recovery_token}"

    print("\n" + "="*60)
    print("📩 EMAIL SIMULADO: RESTABLECIMIENTO DE CONTRASEÑA")
    print(f"Para: {email}")
    print(f"Enlace de simulación (pégalo detrás de tu URL base del Front):")
    print(frontend_url)
    print("="*60 + "\n")

    return jsonify({"msg": "Si el correo existe, recibirás un enlace para restablecer tu contraseña."}), 200


@api.route('/reset-password', methods=['PUT'])
@jwt_required()
def handle_reset_password():
    current_user_id = get_jwt_identity()
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Faltan datos"}), 400

    new_password = body.get("password")
    if not new_password:
        return jsonify({"msg": "La nueva contraseña es obligatoria"}), 400

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    try:
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({"msg": "Contraseña actualizada con éxito. Ya puedes iniciar sesión."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la contraseña", "error": str(e)}), 500
