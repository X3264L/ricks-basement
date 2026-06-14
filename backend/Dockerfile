FROM python:3.12-slim

WORKDIR /app
COPY backend /app
RUN pip install --no-cache-dir uv && uv pip install --system .

EXPOSE 8787
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8787"]
