# Chill Tube

## Setup
#### Dependecies
This app requires [Node.js](https://nodejs.org/) to run.
Before you start your app you need to install all npm dependecies.
You can do that by opening yout project in terminal and running ```npm install --legacy-peer-deps``` command;
#### Environment variables
After installing all dependencies you will need to set up your environment variables. 
You can do that by copying .env.example to .env(.local) and changing the values of all necessery feilds.
#### Database
In order of the app to function propertly you will need to create a database. SQL script can be found in database folder of the project. 

## Startup
### Dev
To start your aplication in dev mode use ```npm run dev``` command in your terminal with app folder as cwd.
After that your app will be started on port 3000.
### Production
To start your app in production mode you need to create production build. You can do that by running ```npm run build``` command in your terminal. After build is completed you can start app by simply entering commant ```npm start``` in your command line interface.
If you wish to host your app firstly you need to create a production build. Then you can transfer your files and folders to the hosting (exept node_modules and .git folders and all env files). After you transfer all your files you can create your node app in your hosting. Check out with your hosting provider how you can do that. After creating a app you can add all your env variables, run npm install and start your app.