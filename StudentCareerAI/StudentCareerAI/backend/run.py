from flask import Flask, jsonify
from flask_cors import CORS

from app.routes.career_routes import career_bp
from app.routes.student_routes import student_bp
from app.routes.placement_routes import placement_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(career_bp)
app.register_blueprint(student_bp)
app.register_blueprint(placement_bp)

@app.route("/")
def home():
    return jsonify({
        "message": "Student Career AI Backend is running!",
        "status": "success"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "message": "Backend API is working"
    })


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )