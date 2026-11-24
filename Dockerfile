FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    HUAXIA_AI_ENABLED=false

WORKDIR /srv/huaxia

COPY requirements.txt requirements-render.txt ./
RUN python -m pip install --no-cache-dir -r requirements-render.txt \
    && mkdir uploads \
    && chown 10001:10001 uploads

COPY app/ ./app/

USER 10001:10001
EXPOSE 8000

CMD ["sh", "-c", "exec python -m uvicorn app.main:app --host 0.0.0.0 --port \"${PORT:-8000}\" --workers 1"]
