import Layout from "../components/Layout";

const Home = () => (
    <Layout>
        <div>
            <h1>Welcome to Purple Model</h1>
            
            <h2 id="introduction">Introduction</h2>
            <p><img src="Purple_model.png" alt="" className="img-fluid" /></p>
            <p>This is a web application for image processing. It is based on Flask and Celery. The backend is written in Python and the frontend is written in Next.js.</p>
            <p>The main goal of this project is to demonstrate the model poisoning attack and defense. The attack is based on the paper <a href=""></a>. The defense is based on the paper <a href="">Defending Against Model Poisoning Attacks</a>.</p>
            <h2 id="build-with">Build with</h2>
            <ul>
                <li><img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&amp;logo=flask&amp;logoColor=white" alt="Flask" /></li>
                <br />
                <li><img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&amp;logo=nextdotjs&amp;logoColor=white" alt="Next.js" /></li>
                <br />
                <li><img src="https://img.shields.io/badge/Celery-37814A.svg?style=for-the-badge&amp;logo=Celery&amp;logoColor=white" alt="Celery" /></li>
            </ul>
        </div>
    </Layout>
);

export default Home;