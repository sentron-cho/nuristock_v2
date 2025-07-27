docker build -t sentron/nuriostock_front:v0.0.1 ./
docker run -d -p 8080:80 --name nuristock_front sentron/nuriostock_front:v0.0.1