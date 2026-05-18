from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="runner")
    
    
    first_name: Mapped[str] = mapped_column(String(80), nullable=True)
    last_name: Mapped[str] = mapped_column(String(80), nullable=True)
    gender: Mapped[str] = mapped_column(String(20), nullable=True)      
    residence: Mapped[str] = mapped_column(String(120), nullable=True)   

    events: Mapped[List["Event"]] = relationship(back_populates="organizer")

    inscriptions: Mapped[List["Inscription"]
                         ] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            # 🔥 Campos serializados para el Frontend
            "first_name": self.first_name,
            "last_name": self.last_name,
            "gender": self.gender,
            "residence": self.residence,
            "my_inscriptions": [ins.event_id for ins in self.inscriptions]
        }


class Event(db.Model):
    __tablename__ = 'event'
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    date: Mapped[str] = mapped_column(String(50), nullable=False)
    location_name: Mapped[str] = mapped_column(String(100))
    latitude: Mapped[float] = mapped_column(nullable=False)
    longitude: Mapped[float] = mapped_column(nullable=False)

    organizer_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)
    organizer: Mapped["User"] = relationship(back_populates="events")

    participants: Mapped[List["Inscription"]
                         ] = relationship(back_populates="event")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "date": self.date,
            "location_name": self.location_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "organizer_id": self.organizer_id,
            "total_participants": len(self.participants)
        }


class Inscription(db.Model):
    __tablename__ = 'inscription'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    event_id: Mapped[int] = mapped_column(
        ForeignKey('event.id'), nullable=False)
    registration_date: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=func.now())

    user: Mapped["User"] = relationship(back_populates="inscriptions")
    event: Mapped["Event"] = relationship(back_populates="participants")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "event_title": self.event.title if self.event else "Evento desconocido",
            "registration_date": self.registration_date.isoformat() if self.registration_date else None
        }