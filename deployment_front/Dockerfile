FROM nginx:1.23.3-alpine
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf ./*
COPY /build  /usr/share/nginx/html
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
CMD ["nginx", "-g", "daemon off;"]