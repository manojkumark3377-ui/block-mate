import { Link, useNavigate } from "react-router-dom";

const PostList = () => {
  const navigate = useNavigate();

  const posts = [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 1" },
    { id: 3, title: "Post 1" },
    { id: 4, title: "Post 1" },
    { id: 5, title: "Post 1" },
    { id: 6, title: "Post 1" },
    { id: 7, title: "Post 1" },
    { id: 8, title: "Post 1" },
    { id: 9, title: "Post 1" },
    { id: 10, title: "Post 1" }
  ];

  const handlePostClick = (postId) => {
    navigate(`/posts/detail/${postId}`);
  };

  return (
    <div>
      <Link to="/posts/new" className="button button-block">
        Add New Post
      </Link>
      <h2 className="table-title">Post list</h2>

      <input
        className="search-input"
        type="text"
        name="search"
        placeholder="Search here"
      />

      <div className="flexbox-container wrap">
        <button className="post-card" onClick={() => handlePostClick(1)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(2)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(3)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(4)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(5)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(6)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(7)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(8)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(9)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
        <button className="post-card" onClick={() => handlePostClick(10)}>
          <h4 className="card-title">Post 1</h4>
          <p className="card-desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam et
            hic quae fugit sint architecto, libero aperiam ut tempore
            voluptatum.
          </p>
        </button>
      </div>

      <div className="pag-container">
        <button className="pag-button">prev</button>
        <button className="pag-button">1</button>
        <button className="pag-button">2</button>
        <button className="pag-button">3</button>
        <button className="pag-button">next</button>
      </div>
    </div>
  );
};

export default PostList;
