import React, { Component } from 'react'
import io from 'socket.io-client'
import api from '../services/api'

import more from '../assets/more.svg'
import like from '../assets/like.svg'
import comment from '../assets/comment.svg'
import send from '../assets/send.svg'

import './feed.css'

class Feed extends Component {
  state = {
    feed: [],
  }

  handleLike = id => async () => {
    api.post(`/posts/${id}/like`)
  }

  registerToSocket = () => {
    const socket = io('http://localhost:3333')

    socket.on('post', newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] })
    })

    socket.on('like', newLikedPost => {
      this.setState({ feed: this.state.feed.map(post => post._id === newLikedPost._id ? newLikedPost : post) })
    })
  }

  async componentDidMount() {
    this.registerToSocket()

    const { data } = await api.get('posts')

    this.setState({ feed: data })
  }

  render() {
    return (
      <section id="post-list">
        {this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>

              <img src={more} alt="Mais" />
            </header>

            <img src={`http://localhost:3333/files/${post.image}`} alt="" />

            <footer>
              <div className="actions">
                <button type="button" onClick={this.handleLike(post._id)}>
                  <img src={like} alt="like"></img>
                </button>
                <img src={comment} alt="comment"></img>
                <img src={send} alt="send"></img>
              </div>
              <strong>{post.likes} curtidas</strong>
              <p>
                {post.description}
                <span> {post.hashtags}</span>
              </p>
            </footer>
          </article>
        ))}
      </section>
    )
  }
}

export default Feed
