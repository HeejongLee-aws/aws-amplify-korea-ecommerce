# Korea-ecommerce-store  



If you want to create new git repository based on this source code, following below instruction guided.

1. git clone https://git-codecommit.ap-northeast-2.amazonaws.com/v1/repos/korea-ecommerce-store
2. cd korea-ecommerce-store
3. rm -rf ./git
4. git init
5. git add .
6. git commit -m "first"
7. git remote add origin <new git repositry>
8. git push

## Directory Structure

    ```
    korea-ecommerce-store
    └ amplify : amplify backend resource 
      src
        └ backapp :  backend serverless application (Lambda, Cloudformation )
        └ frontapp : frontend application (Vue, Javascript)
    ```


if you want to clone this source code to develop, following below instruction guided.

1. git clone https://git-codecommit.ap-northeast-2.amazonaws.com/v1/repos/korea-ecommerce-store
2. cd korea-ecommerce-store
3. amplify status <- Error occur
4. amplify init
-> use an existing environment? Yes
-> choose environment: dev
-> choose editor: Visual Studio Code
-> use AWS profile? Yes
-> choose your profile
-> configure Lambda Triggers for Cognito? No
5. amplify status <- Not Error, Success !
6. amplify push 

7. cd src/frontapp
8. npm install 
9. npm run serve <- Success !