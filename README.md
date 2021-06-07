# AidaBot Chat

<h3>Alexa Skill</h3>
To import AIDA Alexa-hosted skill from this repository

<ol>
  <li>Open the Alexa developer console and log in.</li>
  <li>Click Create Skill. The Create a new skill page appears.</li>
  <li>For Skill name, type a name.</li>
  <li>For Default language, choose a language (en.US).</li>
  <li>For Choose a model to add to your skill, select Custom.</li>
  <li>For Choose a method to host your skill's backend resources, select Alexa-Hosted (Node.js).</li>
  <li>Click Create Skill. The Choose a template to add to your skill page appears.</li>
  <li>Click Import skill. The Import skill dialog appears.</li>
  <li>Enter the .git link to the Git repository that contains the skill that you want to import (https://github.com/infovillasimius/aida.git).</li>
  <li>Click Continue. The message Creating your Alexa-hosted skill appears. If Alexa validates that the Git repository contains an Alexa skill that it can import, Alexa creates       your Alexa-hosted skill.</li>
</ol>

<h3>Web Server</h3>
The skill uses the data from our web server. If you want yours you have to:
<ol>
<li>install elasticsearch on a Linux machine with public ip reachable from the internet</li>
<li>download sample data from https://github.com/infovillasimius/aida/tree/main/data_sample (the authors data for index "authors" are in a splitted zip file which has to be unzipped only once before use with import_dsc_authors_zip.py script)</li>
<li>create four indexes named authors, authors2, aida2 and conferences</li>
<li>index data on elasticsearch using the four python scripts provided</li>
<li>run the web server by launching web_server.py script (configuration options are in config.py and conf.js)</li>
</ol>

<h3><a href="https://aidabot.ddns.net" target="_blank">The web application</a></h3>
The Web Browser application is based onJavascript and JQuery and offers roughly the same functionality as the Alexa skill.
The database can be queried about authors, papers, conferences, organizations, citations and topics.
It is possible to further filter the queries by specifying the name of a particular topic, conference, organization or author.
The results can be sorted according to one of the following four options: publications, citations, publications in the last 5 years, citations in the last 5 years
There are three types of queries:
<ol>
  <li> Describe (e.g .: "describe ISWC")</li>
  <li> Count (e.g .: "count the papers on machine learning")</li>
  <li> List (e.g .: "list the top 5 conferences with papers on rdf graph sorted by publications").</li>
</ol>

You can enter a query all at once in natural language or through a wizard by entering one of the three activation words: describe, count or list.
The audio functions use the Web Speech API which is defined as experimental technology and may not work correctly depending on the compatibility of the browser used, therefore the options to activate them are only available on fully compatible browsers (Google Chrome, Microsoft Edge, Apple Safari: all functions - Mozilla Firefox: only the speech syntetizer).
