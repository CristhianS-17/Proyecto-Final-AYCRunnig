from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

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

    events: Mapped[List["Event"]] = relationship(back_populates="organizer")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active

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

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "date": self.date,
            "location": {
                "name": self.location_name,
                "lat": self.latitude,
                "lng": self.longitude
            },
            "organizer_id": self.organizer_id
        }
