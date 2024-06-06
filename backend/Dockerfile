# Description: Dockerfile for the backend service
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /root/backend

# Copy the current directory contents into the WORKDIR
ADD . /root/backend/

# Install dependencies
RUN pip install -r requirements.txt

# Make data
RUN python make_data.py

# Run the application
CMD ["flask", "run"]

# Flask runs on port 5000
EXPOSE 5000
