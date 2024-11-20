FROM dpokidov/imagemagick

SHELL ["/bin/bash", "--login", "-c"]

RUN useradd -ms /bin/bash www

RUN apt-get update && apt-get install -y curl git build-essential
RUN curl -sL https://deb.nodesource.com/setup_22.x  | bash
RUN apt-get -y install nodejs

RUN mkdir app
WORKDIR app

COPY task/package.json .
RUN npm i
COPY task/ .
RUN mv -f policy.xml /usr/local/etc/ImageMagick-7/policy.xml

RUN mkdir -p uploads
RUN chown www uploads

RUN chmod 0700 /usr/bin/python3
RUN chmod 0700 /usr/bin/perl
RUN chmod 0700 /usr/bin/node
RUN chmod 0700 /usr/bin/nodejs

USER www
