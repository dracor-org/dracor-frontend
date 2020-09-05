import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

export default function DocPage ({match}) {
  const [markdown, setMarkdown] = useState('');
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
        } else {
          setMarkdown('Not Found');
        }
      } catch (error) {
        if (error.message === 'Request failed with status code 404') {
          setMarkdown('Not Found');
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
    <div className="doc-page">
      <ReactMarkdown source={markdown}/>
    </div>
  );
}
