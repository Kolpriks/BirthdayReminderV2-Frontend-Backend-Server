FROM postgres:15-bullseye

WORKDIR /

# Обновляем списки пакетов и устанавливаем необходимые утилиты
RUN apt-get update && apt-get install -y libpq-dev bash

# Копируем скрипты и данные в контейнер
COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d/
COPY migrations /migrations
COPY seed-data /seed-data
COPY apply_migrations.sh /apply_migrations.sh

# Делаем все скрипты инициализации исполняемыми
RUN chmod +x /apply_migrations.sh
RUN chmod +x /docker-entrypoint-initdb.d/*.sh
