user  nginx;
worker_processes  1;
error_log  /var/log/nginx/error.log warn;
pid        /tmp/nginx.pid;
events {
    worker_connections  1024;
}
http {
    client_body_temp_path /tmp/client_temp;
    proxy_temp_path       /tmp/proxy_temp_path;
    fastcgi_temp_path     /tmp/fastcgi_temp;
    uwsgi_temp_path       /tmp/uwsgi_temp;
    scgi_temp_path        /tmp/scgi_temp;
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    keepalive_timeout  65;
    proxy_cache_path /tmp/pleroma-media-cache levels=1:2 keys_zone=pleroma_media_cache:10m max_size=10g
                     inactive=720m use_temp_path=off;
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        location / {
        try_files $uri $uri/ /index.html;
      }
    }
}
