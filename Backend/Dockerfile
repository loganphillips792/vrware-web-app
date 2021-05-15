FROM python:3.9.0-buster

WORKDIR /app/Backend

RUN pip --version
RUN pip install --upgrade pip

COPY ./requirements.txt .

# Install dependencies. Need this for SciPy to install successfully. https://stackoverflow.com/questions/36000204/cant-install-scipy
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get autoremove -y \
    && apt-get install -y \
        gcc \
        build-essential \
        zlib1g-dev \
        wget \
        unzip \
        cmake \
        python3-dev \
        gfortran \
        libblas-dev \
        liblapack-dev \
        libatlas-base-dev \
    && apt-get clean

RUN pip install -r requirements.txt
COPY . .
RUN ["ls", "-a"]
RUN ["pip", "list"]
EXPOSE 8000