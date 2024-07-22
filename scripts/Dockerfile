FROM python:3.9-slim

COPY requirements.txt ./
#RUN pip install --no-cache-dir -r requirements.txt

# Install cron
RUN apt-get update && \
    apt-get install -y cron && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the crontab file and the script
COPY redcap_data.py /app/redcap_data.py
COPY crontab /etc/cron.d/crontab

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/crontab

# Apply cron job
RUN crontab /etc/cron.d/crontab

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD ["cron", "-f"]

