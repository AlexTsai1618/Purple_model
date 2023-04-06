import Layout from "../components/Layout";
import ImageUploadForm from '../components/ImageUploadForm';
const Home = () => (
<Layout>
<div>
<h1>Defend</h1>
<ImageUploadForm pageType={defense}/>
</div>
</Layout>
);

export default Home;