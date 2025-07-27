docker build -t sentron/nuristock_back:v0.0.1 ./
docker run -d -p 3000:3000 --name nuristock_back sentron/nuristock_back:v0.0.1