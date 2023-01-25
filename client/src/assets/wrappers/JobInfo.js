import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;

  .icon {
    font-size: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    svg {
      color: var(--grey-400);
    }
  }
  .text {
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
  }
  .url {
    text-decoration: none;
    letter-spacing: var(--letterSpacing);
    color: var(--textColor);
  }
  .url:hover {
    color: var(--grey-500);
  }
`;
export default Wrapper;
