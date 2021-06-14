import React, {createElement, useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {Helmet} from 'react-helmet';
import {Container, Col} from 'reactstrap';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const heading = ({level, children}) => {
  if (level === 1) {
    return (
      <Header>
        <Col tag="h1">{children}</Col>
      </Header>
    );
  }

  return createElement(`h${level}`, {}, children);
};

const DocPage = ({match}) => {
  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');
  const {slug} = match.params;

  useEffect(() => {
    async function fetchMarkdown () {
      const url = `${process.env.PUBLIC_URL}/doc/${slug}.md`;
      try {
        const response = await axios.get(url);
        if (
          response.status === 200 &&
          response.headers['content-type'].match(/^text\/markdown/)
        ) {
          setMarkdown(response.data);
          const firstLine = response.data
            .replace(/^\s+/, '')
            .split(/(\n|\r|\r\n){2,}/)[0];
          const m = firstLine.match(/^#\s*(.+)/);
          setTitle(m ? m[1] : '...');
        } else {
          setMarkdown('Not Found');
          setTitle('Not Found');
        }
      } catch (error) {
        if (error.message === 'Request failed with status code 404') {
          setMarkdown('Not Found');
          setTitle('Not Found');
        } else {
          console.error(error);
        }
      }
    }

    if (slug) {
      fetchMarkdown();
    }
  }, [slug]);

  return (
    <Container fluid>
      <div className="dracor-page">
        <Helmet titleTemplate="%s - DraCor">
          <title>{title}</title>
        </Helmet>
        <ReactMarkdown source={markdown} renderers={{heading}}/>
        <Footer/>
      </div>
    </Container>
  );
};

export default DocPage;
