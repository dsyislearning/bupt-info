# Description: Dockerfile for the backend service
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /root/backend

# Copy the current directory contents into the WORKDIR
ADD ./src /root/backend/

# Install dependencies
RUN pip install -r requirements.txt

# Make data
RUN python make_data.py

# Flask runs on port 5000
EXPOSE 5000

# Run the application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
