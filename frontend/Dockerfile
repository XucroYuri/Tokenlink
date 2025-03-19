# 使用一个轻量级的nginx镜像
FROM nginx:latest

# 将构建后的前端文件复制到nginx的默认html目录下
COPY dist /usr/share/nginx/html

# 复制nginx的配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80
