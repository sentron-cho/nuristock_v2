docker build -t sentron/nuriostock_v2/front:v0.0.1 ./
docker run -d -p 8080:3050 --name nuristork_front sentron/nuriostock_v2/front:v0.0.1