# Use an official AWS Lambda Python runtime as a parent image
FROM public.ecr.aws/lambda/python:3.10

# Copy the requirements file into the container at /var/task
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# Use --target to install packages into a directory that Lambda can use
RUN pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy the rest of the application's code
# Assuming your Chalice app object is in a file named app.py
COPY app.py .
COPY .chalice ./.chalice

# Set the CMD to your handler.
# The format is <filename>.<Chalice app object name>
# If your app is in 'app.py' and the object is 'app = Chalice(...)', this is correct.
CMD [ "app.app" ]