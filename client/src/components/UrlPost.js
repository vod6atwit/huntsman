import Wrapper from '../assets/wrappers/JobInfo';

const UrlPost = ({ icon, url }) => {
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <a href={url} target="_blank" rel="noopener noreferrer" className="url">
        {url}
      </a>
    </Wrapper>
  );
};

export default UrlPost;
