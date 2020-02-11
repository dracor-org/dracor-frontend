import React from 'react';

const About = () => {
	return (
  		<div>
  			<h2>Drama Corpora Project</h2>
    		<div style={{textAlign: 'left', maxWidth: '800px', padding: '2.2em', lineHeight: '1.7em', color: '#1F2448'}}>
          {`Our two in-house TEI corpora (RusDraCor and GerDraCor) hosted on
            dracor.org are in public-beta state. Feel free to use them, but
            there are some issues that still have to be resolved before the
            official release, which is planned for the summer of 2020.  `
          }
          <br/><br/>
          {'SpanDraCor is based on our fork of the '}
          <a href="https://github.com/GHEDI/BETTE">
            BETTE corpus
          </a>
          {'. '}
          {'ShakeDraCor was derived from the '}
          <a href="https://www.folgerdigitaltexts.org/">
            Shakespeare Folger Library
          </a>
          {', GreekDraCor and RomDraCor from the '}
          <a href="http://www.perseus.tufts.edu/hopper/opensource/download">
            Perseus Digital Library
          </a>
          {', and SweDraCor from '}
          <a href="https://litteraturbanken.se/dramawebben">
            Dramawebben
          </a>
          {', and AlsDraCor from the '}
          <a href="https://git.unistra.fr/ruizfabo/methal-sources">
            MeThAL project
          </a>
          {' at University of Strasbourg.'}
          <br/><br/>
          {'dracor.org is edited by '}
          <a href="https://www.hse.ru/en/org/persons/182492735">
            Frank&nbsp;Fischer
          </a>
          {' (Higher School of Economics, Moscow), '}<br/>
          <a href="https://www.uni-potsdam.de/de/lit-19-jhd/peertrilcke.html">
            Peer&nbsp;Trilcke
          </a>
          {' (University of Potsdam) and '}
          <a href="http://nevmenandr.net/bo.php">
            Boris&nbsp;Orekhov
          </a>
          {' (Higher School of Economics, Moscow).'}
          <br/><br/>
          {'Technical lead: Carsten Milling (Berlin). '}<br/>
          {'Co-leads: Ingo Börner (Austrian Academy of Sciences, Vienna), '}<br/>
          {'Mathias Göbel (Göttingen State and University Library).'}
    		</div>
    		<div className="logos">
      			<img src="/img/hse.svg" alt="Higher School of Economics"/>
      			<img src="/img/uni-potsdam.svg" alt="Universität Potsdam"/>
    		</div>
  		</div>
	);
};

export default About;