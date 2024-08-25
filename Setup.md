# Setup instructions

# backend setup

```shell
pushd backend
python3 -m venv backend
source backend/bin/activate
pip install --no-cache-dir --compile --prefer-binary --upgrade -r requirements.txt
popd
```

# frontend setup

```shell
sudo apt install nodejs npm
npx create-react-app@5.0.1 frontend
pushd frontend
npm install @chakra-ui/react@2.0.2 @emotion/react@11.9.0 @emotion/styled@11.8.1 emotion-theming@11.0.0
mkdir src/components
touch src/components/{Header,Todos}.jsx
popd
```
