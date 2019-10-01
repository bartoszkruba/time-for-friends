FROM node:10 AS build
WORKDIR /app
ENV PATH node_modules/.bin:$PATH
ENV REACT_APP_BACKEND_URI <add your URI here>
ENV REACT_APP_GOOGLE_MAPS_API_KEY <add your key here>
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.0.1 -g
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]