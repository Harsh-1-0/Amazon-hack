import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend API Documentation",
            version: "1.0.0",
            description: "API documentation for the Node.js backend application"
        },

        servers: [
            {
                url: "http://localhost:5500",
                description: "Development server"
            }
        ]
    },
    apis:[
        "./routes/*.js", // Adjust the path to your route files
        "./src/app.js" // Include the main app file if it contains route definitions
    ]
}

const swaggerSpec = swaggerJsDoc(swaggerOptions);

function swaggerDocs(app,port) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/docs.json",(req,res)=>{
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    })

    console.log(`Swagger docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;