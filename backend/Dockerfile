FROM php:8.3-fpm

# Install PostgreSQL dev libraries and PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Set working directory
WORKDIR /var/www/html

# Expose port 80 for the PHP built-in server
EXPOSE 80

# Start PHP built-in server on port 80
CMD ["php", "-S", "0.0.0.0:80", "-t", "/var/www/html"]