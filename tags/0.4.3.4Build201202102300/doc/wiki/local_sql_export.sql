-- phpMyAdmin SQL Dump
-- version 2.11.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 10. Mai 2009 um 21:53
-- Server Version: 5.0.51
-- PHP-Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Datenbank: `mediawiki`
--
USE `db1067403-wiki`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_archive`
--

CREATE TABLE IF NOT EXISTS `cyw_archive` (
  `ar_namespace` int(11) NOT NULL default '0',
  `ar_title` varbinary(255) NOT NULL default '',
  `ar_text` mediumblob NOT NULL,
  `ar_comment` tinyblob NOT NULL,
  `ar_user` int(10) unsigned NOT NULL default '0',
  `ar_user_text` varbinary(255) NOT NULL,
  `ar_timestamp` binary(14) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `ar_minor_edit` tinyint(4) NOT NULL default '0',
  `ar_flags` tinyblob NOT NULL,
  `ar_rev_id` int(10) unsigned default NULL,
  `ar_text_id` int(10) unsigned default NULL,
  `ar_deleted` tinyint(3) unsigned NOT NULL default '0',
  `ar_len` int(10) unsigned default NULL,
  `ar_page_id` int(10) unsigned default NULL,
  `ar_parent_id` int(10) unsigned default NULL,
  KEY `name_title_timestamp` (`ar_namespace`,`ar_title`,`ar_timestamp`),
  KEY `usertext_timestamp` (`ar_user_text`,`ar_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_archive`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_category`
--

CREATE TABLE IF NOT EXISTS `cyw_category` (
  `cat_id` int(10) unsigned NOT NULL auto_increment,
  `cat_title` varbinary(255) NOT NULL,
  `cat_pages` int(11) NOT NULL default '0',
  `cat_subcats` int(11) NOT NULL default '0',
  `cat_files` int(11) NOT NULL default '0',
  `cat_hidden` tinyint(3) unsigned NOT NULL default '0',
  PRIMARY KEY  (`cat_id`),
  UNIQUE KEY `cat_title` (`cat_title`),
  KEY `cat_pages` (`cat_pages`)
) ENGINE=InnoDB DEFAULT CHARSET=binary AUTO_INCREMENT=1 ;

--
-- Daten für Tabelle `cyw_category`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_categorylinks`
--

CREATE TABLE IF NOT EXISTS `cyw_categorylinks` (
  `cl_from` int(10) unsigned NOT NULL default '0',
  `cl_to` varbinary(255) NOT NULL default '',
  `cl_sortkey` varbinary(70) NOT NULL default '',
  `cl_timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  UNIQUE KEY `cl_from` (`cl_from`,`cl_to`),
  KEY `cl_sortkey` (`cl_to`,`cl_sortkey`,`cl_from`),
  KEY `cl_timestamp` (`cl_to`,`cl_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_categorylinks`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_externallinks`
--

CREATE TABLE IF NOT EXISTS `cyw_externallinks` (
  `el_from` int(10) unsigned NOT NULL default '0',
  `el_to` blob NOT NULL,
  `el_index` blob NOT NULL,
  KEY `el_from` (`el_from`,`el_to`(40)),
  KEY `el_to` (`el_to`(60),`el_from`),
  KEY `el_index` (`el_index`(60))
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_externallinks`
--

INSERT INTO `cyw_externallinks` (`el_from`, `el_to`, `el_index`) VALUES
(1, 0x687474703a2f2f6d6574612e77696b696d656469612e6f72672f77696b692f48656c703a436f6e74656e7473, 0x687474703a2f2f6f72672e77696b696d656469612e6d6574612e2f77696b692f48656c703a436f6e74656e7473),
(1, 0x687474703a2f2f7777772e6d6564696177696b692e6f72672f77696b692f4d616e75616c3a436f6e66696775726174696f6e5f73657474696e6773, 0x687474703a2f2f6f72672e6d6564696177696b692e7777772e2f77696b692f4d616e75616c3a436f6e66696775726174696f6e5f73657474696e6773),
(1, 0x687474703a2f2f7777772e6d6564696177696b692e6f72672f77696b692f4d616e75616c3a464151, 0x687474703a2f2f6f72672e6d6564696177696b692e7777772e2f77696b692f4d616e75616c3a464151),
(1, 0x68747470733a2f2f6c697374732e77696b696d656469612e6f72672f6d61696c6d616e2f6c697374696e666f2f6d6564696177696b692d616e6e6f756e6365, 0x68747470733a2f2f6f72672e77696b696d656469612e6c697374732e2f6d61696c6d616e2f6c697374696e666f2f6d6564696177696b692d616e6e6f756e6365);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_filearchive`
--

CREATE TABLE IF NOT EXISTS `cyw_filearchive` (
  `fa_id` int(11) NOT NULL auto_increment,
  `fa_name` varbinary(255) NOT NULL default '',
  `fa_archive_name` varbinary(255) default '',
  `fa_storage_group` varbinary(16) default NULL,
  `fa_storage_key` varbinary(64) default '',
  `fa_deleted_user` int(11) default NULL,
  `fa_deleted_timestamp` binary(14) default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `fa_deleted_reason` blob,
  `fa_size` int(10) unsigned default '0',
  `fa_width` int(11) default '0',
  `fa_height` int(11) default '0',
  `fa_metadata` mediumblob,
  `fa_bits` int(11) default '0',
  `fa_media_type` enum('UNKNOWN','BITMAP','DRAWING','AUDIO','VIDEO','MULTIMEDIA','OFFICE','TEXT','EXECUTABLE','ARCHIVE') default NULL,
  `fa_major_mime` enum('unknown','application','audio','image','text','video','message','model','multipart') default 'unknown',
  `fa_minor_mime` varbinary(32) default 'unknown',
  `fa_description` tinyblob,
  `fa_user` int(10) unsigned default '0',
  `fa_user_text` varbinary(255) default NULL,
  `fa_timestamp` binary(14) default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `fa_deleted` tinyint(3) unsigned NOT NULL default '0',
  PRIMARY KEY  (`fa_id`),
  KEY `fa_name` (`fa_name`,`fa_timestamp`),
  KEY `fa_storage_group` (`fa_storage_group`,`fa_storage_key`),
  KEY `fa_deleted_timestamp` (`fa_deleted_timestamp`),
  KEY `fa_user_timestamp` (`fa_user_text`,`fa_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=binary AUTO_INCREMENT=1 ;

--
-- Daten für Tabelle `cyw_filearchive`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_hitcounter`
--

CREATE TABLE IF NOT EXISTS `cyw_hitcounter` (
  `hc_id` int(10) unsigned NOT NULL
) ENGINE=MEMORY DEFAULT CHARSET=latin1 MAX_ROWS=25000;

--
-- Daten für Tabelle `cyw_hitcounter`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_image`
--

CREATE TABLE IF NOT EXISTS `cyw_image` (
  `img_name` varbinary(255) NOT NULL default '',
  `img_size` int(10) unsigned NOT NULL default '0',
  `img_width` int(11) NOT NULL default '0',
  `img_height` int(11) NOT NULL default '0',
  `img_metadata` mediumblob NOT NULL,
  `img_bits` int(11) NOT NULL default '0',
  `img_media_type` enum('UNKNOWN','BITMAP','DRAWING','AUDIO','VIDEO','MULTIMEDIA','OFFICE','TEXT','EXECUTABLE','ARCHIVE') default NULL,
  `img_major_mime` enum('unknown','application','audio','image','text','video','message','model','multipart') NOT NULL default 'unknown',
  `img_minor_mime` varbinary(32) NOT NULL default 'unknown',
  `img_description` tinyblob NOT NULL,
  `img_user` int(10) unsigned NOT NULL default '0',
  `img_user_text` varbinary(255) NOT NULL,
  `img_timestamp` varbinary(14) NOT NULL default '',
  `img_sha1` varbinary(32) NOT NULL default '',
  PRIMARY KEY  (`img_name`),
  KEY `img_usertext_timestamp` (`img_user_text`,`img_timestamp`),
  KEY `img_size` (`img_size`),
  KEY `img_timestamp` (`img_timestamp`),
  KEY `img_sha1` (`img_sha1`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_image`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_imagelinks`
--

CREATE TABLE IF NOT EXISTS `cyw_imagelinks` (
  `il_from` int(10) unsigned NOT NULL default '0',
  `il_to` varbinary(255) NOT NULL default '',
  UNIQUE KEY `il_from` (`il_from`,`il_to`),
  KEY `il_to` (`il_to`,`il_from`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_imagelinks`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_interwiki`
--

CREATE TABLE IF NOT EXISTS `cyw_interwiki` (
  `iw_prefix` varbinary(32) NOT NULL,
  `iw_url` blob NOT NULL,
  `iw_local` tinyint(1) NOT NULL,
  `iw_trans` tinyint(4) NOT NULL default '0',
  UNIQUE KEY `iw_prefix` (`iw_prefix`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_interwiki`
--

INSERT INTO `cyw_interwiki` (`iw_prefix`, `iw_url`, `iw_local`, `iw_trans`) VALUES
('acronym', 0x687474703a2f2f7777772e6163726f6e796d66696e6465722e636f6d2f61662d71756572792e6173703f537472696e673d6578616374264163726f6e796d3d2431, 0, 0),
('advogato', 0x687474703a2f2f7777772e6164766f6761746f2e6f72672f2431, 0, 0),
('annotationwiki', 0x687474703a2f2f7777772e7365656477696b692e636f6d2f706167652e63666d3f77696b6969643d33363826646f633d2431, 0, 0),
('arxiv', 0x687474703a2f2f7777772e61727869762e6f72672f6162732f2431, 0, 0),
('c2find', 0x687474703a2f2f63322e636f6d2f6367692f77696b693f46696e64506167652676616c75653d2431, 0, 0),
('cache', 0x687474703a2f2f7777772e676f6f676c652e636f6d2f7365617263683f713d63616368653a2431, 0, 0),
('commons', 0x687474703a2f2f636f6d6d6f6e732e77696b696d656469612e6f72672f77696b692f2431, 0, 0),
('corpknowpedia', 0x687474703a2f2f636f72706b6e6f7770656469612e6f72672f77696b692f696e6465782e7068702f2431, 0, 0),
('dictionary', 0x687474703a2f2f7777772e646963742e6f72672f62696e2f446963743f44617461626173653d2a26466f726d3d44696374312653747261746567793d2a2651756572793d2431, 0, 0),
('disinfopedia', 0x687474703a2f2f7777772e646973696e666f70656469612e6f72672f77696b692e7068746d6c3f7469746c653d2431, 0, 0),
('docbook', 0x687474703a2f2f77696b692e646f63626f6f6b2e6f72672f746f7069632f2431, 0, 0),
('doi', 0x687474703a2f2f64782e646f692e6f72672f2431, 0, 0),
('drumcorpswiki', 0x687474703a2f2f7777772e6472756d636f72707377696b692e636f6d2f696e6465782e7068702f2431, 0, 0),
('dwjwiki', 0x687474703a2f2f7777772e737562657269632e6e65742f6367692d62696e2f64776a2f77696b692e6367693f2431, 0, 0),
('elibre', 0x687474703a2f2f656e6369636c6f70656469612e75732e65732f696e6465782e7068702f2431, 0, 0),
('emacswiki', 0x687474703a2f2f7777772e656d61637377696b692e6f72672f6367692d62696e2f77696b692e706c3f2431, 0, 0),
('foldoc', 0x687474703a2f2f666f6c646f632e6f72672f3f2431, 0, 0),
('foxwiki', 0x687474703a2f2f666f782e77696b69732e636f6d2f77632e646c6c3f57696b697e2431, 0, 0),
('freebsdman', 0x687474703a2f2f7777772e467265654253442e6f72672f6367692f6d616e2e6367693f6170726f706f733d312671756572793d2431, 0, 0),
('gej', 0x687474703a2f2f7777772e6573706572616e746f2e64652f6367692d62696e2f616b746976696b696f2f77696b692e706c3f2431, 0, 0),
('gentoo-wiki', 0x687474703a2f2f67656e746f6f2d77696b692e636f6d2f2431, 0, 0),
('google', 0x687474703a2f2f7777772e676f6f676c652e636f6d2f7365617263683f713d2431, 0, 0),
('googlegroups', 0x687474703a2f2f67726f7570732e676f6f676c652e636f6d2f67726f7570733f713d2431, 0, 0),
('hammondwiki', 0x687474703a2f2f7777772e64616972696b692e6f72672f48616d6d6f6e6457696b692f2431, 0, 0),
('hewikisource', 0x687474703a2f2f68652e77696b69736f757263652e6f72672f77696b692f2431, 1, 0),
('hrwiki', 0x687474703a2f2f7777772e687277696b692e6f72672f696e6465782e7068702f2431, 0, 0),
('imdb', 0x687474703a2f2f75732e696d64622e636f6d2f5469746c653f2431, 0, 0),
('jargonfile', 0x687474703a2f2f73756e69722e6f72672f617070732f6d6574612e706c3f77696b693d4a6172676f6e46696c652672656469726563743d2431, 0, 0),
('jspwiki', 0x687474703a2f2f7777772e6a737077696b692e6f72672f77696b692f2431, 0, 0),
('keiki', 0x687474703a2f2f6b65692e6b692f656e2f2431, 0, 0),
('kmwiki', 0x687474703a2f2f6b6d77696b692e77696b697370616365732e636f6d2f2431, 0, 0),
('linuxwiki', 0x687474703a2f2f6c696e757877696b692e64652f2431, 0, 0),
('lojban', 0x687474703a2f2f7777772e6c6f6a62616e2e6f72672f74696b692f74696b692d696e6465782e7068703f706167653d2431, 0, 0),
('lqwiki', 0x687474703a2f2f77696b692e6c696e75787175657374696f6e732e6f72672f77696b692f2431, 0, 0),
('lugkr', 0x687474703a2f2f6c75672d6b722e736f75726365666f7267652e6e65742f6367692d62696e2f6c756777696b692e706c3f2431, 0, 0),
('mathsongswiki', 0x687474703a2f2f5365656457696b692e636f6d2f706167652e63666d3f77696b6969643d32333726646f633d2431, 0, 0),
('meatball', 0x687474703a2f2f7777772e7573656d6f642e636f6d2f6367692d62696e2f6d622e706c3f2431, 0, 0),
('mediawikiwiki', 0x687474703a2f2f7777772e6d6564696177696b692e6f72672f77696b692f2431, 0, 0),
('mediazilla', 0x687474703a2f2f6275677a696c6c612e77696b6970656469612e6f72672f2431, 1, 0),
('memoryalpha', 0x687474703a2f2f7777772e6d656d6f72792d616c7068612e6f72672f656e2f696e6465782e7068702f2431, 0, 0),
('metawiki', 0x687474703a2f2f73756e69722e6f72672f617070732f6d6574612e706c3f2431, 0, 0),
('metawikipedia', 0x687474703a2f2f6d6574612e77696b696d656469612e6f72672f77696b692f2431, 0, 0),
('moinmoin', 0x687474703a2f2f7075726c2e6e65742f77696b692f6d6f696e2f2431, 0, 0),
('mozillawiki', 0x687474703a2f2f77696b692e6d6f7a696c6c612e6f72672f696e6465782e7068702f2431, 0, 0),
('oeis', 0x687474703a2f2f7777772e72657365617263682e6174742e636f6d2f6367692d62696e2f6163636573732e6367692f61732f6e6a61732f73657175656e6365732f656973412e6367693f416e756d3d2431, 0, 0),
('openfacts', 0x687474703a2f2f6f70656e66616374732e6265726c696f732e64652f696e6465782e7068746d6c3f7469746c653d2431, 0, 0),
('openwiki', 0x687474703a2f2f6f70656e77696b692e636f6d2f3f2431, 0, 0),
('patwiki', 0x687474703a2f2f67617573732e666669692e6f72672f2431, 0, 0),
('pmeg', 0x687474703a2f2f7777772e62657274696c6f772e636f6d2f706d65672f24312e706870, 0, 0),
('ppr', 0x687474703a2f2f63322e636f6d2f6367692f77696b693f2431, 0, 0),
('pythoninfo', 0x687474703a2f2f77696b692e707974686f6e2e6f72672f6d6f696e2f2431, 0, 0),
('rfc', 0x687474703a2f2f7777772e7266632d656469746f722e6f72672f7266632f72666324312e747874, 0, 0),
('s23wiki', 0x687474703a2f2f69732d726f6f742e64652f77696b692f696e6465782e7068702f2431, 0, 0),
('seattlewiki', 0x687474703a2f2f73656174746c652e77696b69612e636f6d2f77696b692f2431, 0, 0),
('seattlewireless', 0x687474703a2f2f73656174746c65776972656c6573732e6e65742f3f2431, 0, 0),
('senseislibrary', 0x687474703a2f2f73656e736569732e786d702e6e65742f3f2431, 0, 0),
('slashdot', 0x687474703a2f2f736c617368646f742e6f72672f61727469636c652e706c3f7369643d2431, 0, 0),
('sourceforge', 0x687474703a2f2f736f75726365666f7267652e6e65742f2431, 0, 0),
('squeak', 0x687474703a2f2f77696b692e73717565616b2e6f72672f73717565616b2f2431, 0, 0),
('susning', 0x687474703a2f2f7777772e7375736e696e672e6e752f2431, 0, 0),
('svgwiki', 0x687474703a2f2f77696b692e7376672e6f72672f2431, 0, 0),
('tavi', 0x687474703a2f2f746176692e736f75726365666f7267652e6e65742f2431, 0, 0),
('tejo', 0x687474703a2f2f7777772e74656a6f2e6f72672f76696b696f2f2431, 0, 0),
('theopedia', 0x687474703a2f2f7777772e7468656f70656469612e636f6d2f2431, 0, 0),
('tmbw', 0x687474703a2f2f7777772e746d62772e6e65742f77696b692f2431, 0, 0),
('tmnet', 0x687474703a2f2f7777772e746563686e6f6d616e69666573746f732e6e65742f3f2431, 0, 0),
('tmwiki', 0x687474703a2f2f7777772e45617379546f7069634d6170732e636f6d2f3f706167653d2431, 0, 0),
('twiki', 0x687474703a2f2f7477696b692e6f72672f6367692d62696e2f766965772f2431, 0, 0),
('uea', 0x687474703a2f2f7777772e74656a6f2e6f72672f7565612f2431, 0, 0),
('unreal', 0x687474703a2f2f77696b692e6265796f6e64756e7265616c2e636f6d2f77696b692f2431, 0, 0),
('usemod', 0x687474703a2f2f7777772e7573656d6f642e636f6d2f6367692d62696e2f77696b692e706c3f2431, 0, 0),
('vinismo', 0x687474703a2f2f76696e69736d6f2e636f6d2f656e2f2431, 0, 0),
('webseitzwiki', 0x687474703a2f2f776562736569747a2e666c7578656e742e636f6d2f77696b692f2431, 0, 0),
('why', 0x687474703a2f2f636c75626c65742e636f6d2f632f632f7768793f2431, 0, 0),
('wiki', 0x687474703a2f2f63322e636f6d2f6367692f77696b693f2431, 0, 0),
('wikia', 0x687474703a2f2f7777772e77696b69612e636f6d2f77696b692f2431, 0, 0),
('wikibooks', 0x687474703a2f2f656e2e77696b69626f6f6b732e6f72672f77696b692f2431, 1, 0),
('wikicities', 0x687474703a2f2f7777772e77696b696369746965732e636f6d2f696e6465782e7068702f2431, 0, 0),
('wikif1', 0x687474703a2f2f7777772e77696b6966312e6f72672f2431, 0, 0),
('wikihow', 0x687474703a2f2f7777772e77696b69686f772e636f6d2f2431, 0, 0),
('wikimedia', 0x687474703a2f2f77696b696d65646961666f756e646174696f6e2e6f72672f77696b692f2431, 0, 0),
('wikinews', 0x687474703a2f2f656e2e77696b696e6577732e6f72672f77696b692f2431, 1, 0),
('wikinfo', 0x687474703a2f2f7777772e77696b696e666f2e6f72672f696e6465782e7068702f2431, 0, 0),
('wikipedia', 0x687474703a2f2f656e2e77696b6970656469612e6f72672f77696b692f2431, 1, 0),
('wikiquote', 0x687474703a2f2f656e2e77696b6971756f74652e6f72672f77696b692f2431, 1, 0),
('wikisource', 0x687474703a2f2f736f75726365732e77696b6970656469612e6f72672f77696b692f2431, 1, 0),
('wikispecies', 0x687474703a2f2f737065636965732e77696b6970656469612e6f72672f77696b692f2431, 1, 0),
('wikitravel', 0x687474703a2f2f77696b6974726176656c2e6f72672f656e2f2431, 0, 0),
('wikt', 0x687474703a2f2f656e2e77696b74696f6e6172792e6f72672f77696b692f2431, 1, 0),
('wiktionary', 0x687474703a2f2f656e2e77696b74696f6e6172792e6f72672f77696b692f2431, 1, 0),
('wlug', 0x687474703a2f2f7777772e776c75672e6f72672e6e7a2f2431, 0, 0),
('zwiki', 0x687474703a2f2f7a77696b692e6f72672f2431, 0, 0),
('zzz wiki', 0x687474703a2f2f77696b692e7a7a7a2e65652f696e6465782e7068702f2431, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_ipblocks`
--

CREATE TABLE IF NOT EXISTS `cyw_ipblocks` (
  `ipb_id` int(11) NOT NULL auto_increment,
  `ipb_address` tinyblob NOT NULL,
  `ipb_user` int(10) unsigned NOT NULL default '0',
  `ipb_by` int(10) unsigned NOT NULL default '0',
  `ipb_by_text` varbinary(255) NOT NULL default '',
  `ipb_reason` tinyblob NOT NULL,
  `ipb_timestamp` binary(14) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `ipb_auto` tinyint(1) NOT NULL default '0',
  `ipb_anon_only` tinyint(1) NOT NULL default '0',
  `ipb_create_account` tinyint(1) NOT NULL default '1',
  `ipb_enable_autoblock` tinyint(1) NOT NULL default '1',
  `ipb_expiry` varbinary(14) NOT NULL default '',
  `ipb_range_start` tinyblob NOT NULL,
  `ipb_range_end` tinyblob NOT NULL,
  `ipb_deleted` tinyint(1) NOT NULL default '0',
  `ipb_block_email` tinyint(1) NOT NULL default '0',
  `ipb_allow_usertalk` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`ipb_id`),
  UNIQUE KEY `ipb_address` (`ipb_address`(255),`ipb_user`,`ipb_auto`,`ipb_anon_only`),
  KEY `ipb_user` (`ipb_user`),
  KEY `ipb_range` (`ipb_range_start`(8),`ipb_range_end`(8)),
  KEY `ipb_timestamp` (`ipb_timestamp`),
  KEY `ipb_expiry` (`ipb_expiry`)
) ENGINE=InnoDB DEFAULT CHARSET=binary AUTO_INCREMENT=1 ;

--
-- Daten für Tabelle `cyw_ipblocks`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_job`
--

CREATE TABLE IF NOT EXISTS `cyw_job` (
  `job_id` int(10) unsigned NOT NULL auto_increment,
  `job_cmd` varbinary(60) NOT NULL default '',
  `job_namespace` int(11) NOT NULL,
  `job_title` varbinary(255) NOT NULL,
  `job_params` blob NOT NULL,
  PRIMARY KEY  (`job_id`),
  KEY `job_cmd` (`job_cmd`,`job_namespace`,`job_title`)
) ENGINE=InnoDB DEFAULT CHARSET=binary AUTO_INCREMENT=1 ;

--
-- Daten für Tabelle `cyw_job`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_langlinks`
--

CREATE TABLE IF NOT EXISTS `cyw_langlinks` (
  `ll_from` int(10) unsigned NOT NULL default '0',
  `ll_lang` varbinary(20) NOT NULL default '',
  `ll_title` varbinary(255) NOT NULL default '',
  UNIQUE KEY `ll_from` (`ll_from`,`ll_lang`),
  KEY `ll_lang` (`ll_lang`,`ll_title`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_langlinks`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_logging`
--

CREATE TABLE IF NOT EXISTS `cyw_logging` (
  `log_id` int(10) unsigned NOT NULL auto_increment,
  `log_type` varbinary(10) NOT NULL default '',
  `log_action` varbinary(10) NOT NULL default '',
  `log_timestamp` binary(14) NOT NULL default '19700101000000',
  `log_user` int(10) unsigned NOT NULL default '0',
  `log_namespace` int(11) NOT NULL default '0',
  `log_title` varbinary(255) NOT NULL default '',
  `log_comment` varbinary(255) NOT NULL default '',
  `log_params` blob NOT NULL,
  `log_deleted` tinyint(3) unsigned NOT NULL default '0',
  PRIMARY KEY  (`log_id`),
  KEY `type_time` (`log_type`,`log_timestamp`),
  KEY `user_time` (`log_user`,`log_timestamp`),
  KEY `page_time` (`log_namespace`,`log_title`,`log_timestamp`),
  KEY `times` (`log_timestamp`)
) ENGINE=InnoDB  DEFAULT CHARSET=binary AUTO_INCREMENT=11 ;

--
-- Daten für Tabelle `cyw_logging`
--

INSERT INTO `cyw_logging` (`log_id`, `log_type`, `log_action`, `log_timestamp`, `log_user`, `log_namespace`, `log_title`, `log_comment`, `log_params`, `log_deleted`) VALUES
(1, 'patrol', 'patrol', '20090508214118', 1, 8, 'Sidebar', '', 0x320a300a31, 0),
(2, 'patrol', 'patrol', '20090508214211', 1, 8, 'Sidebar', '', 0x330a320a31, 0),
(3, 'patrol', 'patrol', '20090508214228', 1, 8, 'Sidebar', '', 0x340a330a31, 0),
(4, 'patrol', 'patrol', '20090508214313', 1, 0, 'First_Page', '', 0x350a300a31, 0),
(5, 'patrol', 'patrol', '20090508214415', 1, 8, 'Sidebar', '', 0x360a340a31, 0),
(6, 'patrol', 'patrol', '20090508214446', 1, 8, 'Sidebar', '', 0x370a360a31, 0),
(7, 'patrol', 'patrol', '20090508215209', 1, 8, 'Sitenotice', '', 0x380a300a31, 0),
(8, 'move', 'move', '20090508215728', 1, 0, 'First_Page', '', 0x5365636f6e6420506167650a, 0),
(9, 'patrol', 'patrol', '20090508215954', 1, 8, 'Monobook.css', '', 0x31310a300a31, 0),
(10, 'patrol', 'patrol', '20090508220144', 1, 8, 'Monobook.css', '', 0x31320a31310a31, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_math`
--

CREATE TABLE IF NOT EXISTS `cyw_math` (
  `math_inputhash` varbinary(16) NOT NULL,
  `math_outputhash` varbinary(16) NOT NULL,
  `math_html_conservativeness` tinyint(4) NOT NULL,
  `math_html` blob,
  `math_mathml` blob,
  UNIQUE KEY `math_inputhash` (`math_inputhash`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_math`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_objectcache`
--

CREATE TABLE IF NOT EXISTS `cyw_objectcache` (
  `keyname` varbinary(255) NOT NULL default '',
  `value` mediumblob,
  `exptime` datetime default NULL,
  PRIMARY KEY  (`keyname`),
  KEY `exptime` (`exptime`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_objectcache`
--

INSERT INTO `cyw_objectcache` (`keyname`, `value`, `exptime`) VALUES
('mediawiki-MW_:messages:en', 0x458f416b02311085effe8a21c71cd495624bf6b42e5b15ac29665b04f1905d6735b824b213eda1eb7f3729142fc3e331f3bd375abc885f12af822973c04a772c25f19608061cacbe99a3f6c6d901e7efa6230f9ffa88fd53069f9748be8f63c04115d9265f04514ab99ac96d50ab6c3dffcae6858ae0641c733c5ae74d8dd1994c43d46e57cabc2f75d522b8067267c38aa7fdfeef6622d887b3ae72ee3cac89a2378d05471c72a5e0d2ea1a0f70c20ee1c7b42de8a6c1dac395b0a388f327847f00d0d958e0a308093f7f171bb5946b961a91a4f707, '2009-05-11 12:28:21'),
('mediawiki-MW_:pcache:idhash:1-0!1!0!!en!2', 0xad566d6fdb3610ee67fd0a5a1fb64fb65e66a70ead6818822c0950371e9a361f8621a0a5b34d84220592aae316fdef3bd2b2233be8903633fcca3bde3dcfddc3a36f6892d270c6b4017dd3d8bab1214d53fad5d0110dab5b78b4e1c4d0643846afacceb3395fe25b3e8592b33bfec0c98a19320790c4344501c62c1a2136844b639910500eb2689ee30bb705598401eafc5c49d3084bec0a48c6c84ac3e22c5c595bd328aac0b2c11ae3562ec140e965e47e4557206a8a1b2d486b42520866cc5988e8404b2688753889e556c08f86d220ce42a9164a08b50ef38f58875f0db96c780959c472b2501ad9e07bc52c5792e0b3315c2e3d7c179018b5b06ba661e009064849b20a715c82b5e8788f95d016ca90f0f2f962ee9264ab34cf4ccde49e58c9ad81c2250cf3bff7458a3c15cf82cb121e07f5aafe7dcb7acab8bc9fb125fcc2aa7ac2fcd63317c6ff6e639d25fb225da089b4cb94b4a8c81e95dbe990fd93450e574e0ee055ebfe0a5829b884303fde4cda2d5984ac82ac11792678feacd3ebf57ab0a7f3d49d29930d13ae3f0bbe6cb4aff9bdd9667861e37f2ef2910e0edcc8ce8d086e7c5db0d548ea2788fdf9c75fff070b1fe608f2d39944eb7f813418de113147c7a3625c544c7a9b93fc93dcfa4c4ad5c8025e80fd55d1bf4b090dc00c1017c589eda81111ca2c08b25ebf4f82f7b09ecdd0a142856ba895b6c10c3fb572e3094fb354259002135a4a465112fb473053c6f6e111955be2792f44834e867f014ae2288d4fdf26a394cc37164c700b552d9805c2f4b2a9708a7cc7efe2b10669f86720b51faf64811cbd9cdae4b14b1ef4fb3be41fd86770c977fe052bfc8cb12bf2001bf254afe9dd3dadbd95f21207f08a26fdb897f4e25e0f642f258e83c5d2e389ac6a92c6f1693c4ae2244dc769425cbeed4cc701ff8ec9658353e31d970f269c301ad3afdfd096a0ed1c392e95e6d035bc75061c9e386ecc8d28a76cc98b7032a7b18b18bb2bc32961776fe042b8339c3bbcb7886a97fc10975b1da3db27d0c68dbd89bf8192c1c960e8be9f38b047207dbab619ddf5b4b37e5d762c0efc758574bbdeae0c17ad9af71986ee061ca2e9872e9309a789c37d4a5f358bda30c3f88561dc3068f79cfc465f7d087da89d08f0307d682fa26e97dfab4b77bdebcdc1ea155e0ad716aae3666cff585c29d56d1f16a9ba635a6e297757db84c77a9c695583b6077a4c51176fbaff5ede54d7ee669c29c18b4d4782cf1d4b6e50211bafd72305b727e740a8c3741c8fd3d3d1289c7cfb17, '2009-05-11 12:28:21'),
('mediawiki-MW_:pcache:idhash:2-0!1!0!!en!2', 0x75535d6fda3014ed737e85c97b8a13055a0caac41003244aa2c1d6bd4d6e72172c123bb21d3ed6f6bfcfcec816689787c439e7eade73efb98e881f1037a652818c2a5d56da2541405e14e911b7d8c051bb4345c25e48dc51953f8c72f68038ddb38c6a26b8d3609f99541ac53483d77fc7bfec06947eb52f67d435bfa3aec1df1f6deaf574fc65326f019b285a7e8abeb790e57835fb3a9e4dd7ed0ccea8e379c859c1218e51ce0aa691845248edc4e62b45024a0989b8480125a2e29a20bfebe3fa7162a1b407c792f214319ee4950952ec171084bb011edcf9bd003d9f342867034599530d88caac2a80ebffc44d8f2570c5f680ca7ab2e867c5133bb0a638b6c51dcf6b94afe91e6cf1263ea1c916d081e92ddac1091590327a603be63d3efd2065cd12966ea9da92c0c31dbf833b1de09d00d91e342bccac6951a200e301eee1fbc00fc3b08f6c3d6ba76fdc2c969467957169c9f84eb9434a307979339c6fb889e9311392419bb8b384e09a32aea23c7da4194bdce133c13623b6dbc2740ecdca18c06d8889d5bb31aa9ae297ba2c7a6fc2be81546646f6d72c9f7fdbbf0dedb96fc55e89accb9dcd68e3410b5fa42dc68a5f14a6dd76b41dc3f4a841729a7f3406b34e6ba87dbbe873256634cf419e2ed039d074a1a1b896f3e756cd8568a71f18e2894ace7876859e0b5e4b89a52841ea0b470233999bf6d5bd29163c85632c72969c5a26bc0f4c9932333ad58e5d7978de9d8facf27beef0ed37, '2009-05-09 21:44:46'),
('mediawiki-MW_:pcache:idhash:3-0!1!0!!en!2', 0x7553c16ea33014ec99af30dc698cd3348913e55255db486d83d4687b5cb9f0965801dbb24d035bf5dfd7a641226c970b62e6c9336fc6ec68426894326d40ef6aab6a1b5142e887a1331a557b686cb432749a601aadd5660fc606eb89da04eb308e51f00ca7344525afb8451a94d43648dd5bcb0c8c911a099903ca642d2c45c924c1dd13a4d2d8181ac5448eb8c8cada0d19fe0728c2138297f36446d05b6bc1047ba854c92c20a68bba0261ff3377df281086bf0352dd26e8772d32cba5e8c5b1170fe278137c397f61efe0c5fbf98c650740276e0fe8082daa20e7ecc48f3c7e7afd4555c7529e1f9839d0698cc324c461082224c8ef6079e57261954204e3259ee1054966f3e90df27a3ebee4c665f9c84451b3021eb9389a68c528a61f9f8e4b1c77e7762ca4e63024e69e90c2322eccaecc9f58c1b368f546b13f11fb76b82da1afc801514fdc79bf7be7aa17bff4e5d1851bfb09dab88cfca72b3bb9bebdeea85b6f7664b2933b9731c4c900dfe603c69bdf566edde1b48fe1beb1a0052bbf8bc15da717e87abbd8f359fe606509babd401f80e55b0bd5d8ced72d7e907278fcd211af4c0b2e8a117a161c5b49b554a0ed4523c4257335fc55aeaaadc8a14965c9b37650c2bf8339372ea3b66b6cd4e1f9ee7c57155944abcfbf, '2009-05-09 21:57:34'),
('mediawiki-MW_:pcache:idhash:4-0!1!0!!en!2', 0x7553cb6edb3010cc595f41f350b407c594ea3c4c3f7a3082c640120b88d11c0b46dad844249220a9d84ee07fef52890ad96d7490a89d25777666b9e049ca6926ac03bba8bda93de569cadf1c3fe3b45ac2d6d391e383c180d3b1998e05595b789ad07e0585141bf92cfb5215b03d356bf3c34b5fc264b9987d11951989dc4bad2698e79b7f0b4529d5f324a1242f857313aa6043c9fb268abbc8572356400a0d8e28ed096ca5f3dfe874291e4b20fa89ccb4f2a0bc1bf7c5341af70dbe7a714ca23bd864192965253db160b4f551865fab73704e5b3cac0092eb5a794e927ec29a27cab4f3316c8d5005912a2f6b4c72f2153861fd940d2f92b3943cee3cb868099529850722ecaaae90c12779575b03cac91720a6d1933cd5aa11a12dce42f1288ea7d13bf37bf102a1789b9f8b7c0d6423fd9a3cc38efcd538be7df8cd4d837259ac855bf341cc7a498ff57aa07a29093d785981f3a83449191bb233769922353624a15e3031410fab1ba15635ca7c8356383a129cf1b73d62096233ec71a5ad842e701100145e48e51665712b5632a7a347cec2892ccc4830b01d140cd0169805be4b64d5163fe415a29798f60bac438dc22f8e5c727a7e3a08ebf340b62599f03789159b85e3df7918173a0aa1fdbea5f16152977bda89cf8b0e129a9a572843373bc873b5f5609528ff270f8ed93d347e1ef47fa77f8ab204bb3b885e8328e61eaa633aef77ec5aebeef143041e845552ad8ea21f058fa964561bb0fec0a914153be95ee4936a1eae66a64b99ef3ae6fc9b5848871aed1a278fbcfd98a9cf2cdcff01, '2009-05-09 21:52:09'),
('mediawiki-MW_:pcache:idhash:6-0!1!0!!en!2', 0x7553c16ee23010ed395f31c9b1528a93022d067141d516a99448a0ed71659221b148ecc8760a6cd57faf9d8214e8ae2f91e78dfcdebc3759d228a641c29446b56c4cdd9880c631fdd07440836a8d07138c35bd1f0e6930a9a7bd5b98ad5650972cc50c0a54087b5e96c0b65b4c0d34f6110d720ba6405848213752ee40efb880db9e37e9d5536fe2872178afb84f122879c50d28aca5325e62bf4aa6a8b55420648690ca46180a512f22edf112a94d88879a890cb848cbc63669fe1729905e4c460fd12086cdd1a0f6d658598d0681a9bca95098fff43d1d6a149abf23d4ad03b06d446ab8146772e2c8bd309c7adfca57ec1d1df9b93f6569e13c3005ecf00815669cedf98e878bb73fb46e51cab382e9820e43e2473ef17d147e0c6e06c32bd4865535c4848cc8803cc63189fa7d707ccef6a86f337861226f588e2f5cec74306694d08f4f8b45169bd91973a93876810707486118177a59660b96f334186f28712f12972a37259ea3b585e00ccc9cdeb5557526bfd4e5aa8fb6edb74dd97ae4ae7649a2bbe15d0b0d9dd82b912ddd298c6e3deed4e7590771e2e7951db7dbed6c783a18548295ffb2c1aed30adbdc2ee67c95bf5859a23a5e549f91657383d5b59cefed7fb61bdb41461678634a70915f554f84d75212256b54e62291d83a73d3fdc56eaab9c8f090c892a7c74e083f1b33aead47c736b1ab0c4fbbf323aa68301adc07e3cf2f, '2009-05-09 22:01:44'),
('mediawiki-MW_:sitenotice', 0x258e416ec2301045f73dc5681655d93421315471e274c101bae102133c6e2c1cdbc2238154717748d9fd27fd273dd28dfe2b5a699c6509d817bd557b8d431e0782f9c2ce60b5b0f574f5675ff968f9f699e7fc2d5e029be3cfe19d96dcd3497c8ae6f9937fbeb00d3e9ecd16e114a8148391af082f099f167c64fa65b0890bc424c0375f6483e391a6c0901c1c52148e52868ac6b7a1cae39ab6565299d7d9361a89dbe6cb122bd7d65dcb7bc7b6eea6da759352b4e31df6f707, '2009-05-10 20:01:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_oldimage`
--

CREATE TABLE IF NOT EXISTS `cyw_oldimage` (
  `oi_name` varbinary(255) NOT NULL default '',
  `oi_archive_name` varbinary(255) NOT NULL default '',
  `oi_size` int(10) unsigned NOT NULL default '0',
  `oi_width` int(11) NOT NULL default '0',
  `oi_height` int(11) NOT NULL default '0',
  `oi_bits` int(11) NOT NULL default '0',
  `oi_description` tinyblob NOT NULL,
  `oi_user` int(10) unsigned NOT NULL default '0',
  `oi_user_text` varbinary(255) NOT NULL,
  `oi_timestamp` binary(14) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `oi_metadata` mediumblob NOT NULL,
  `oi_media_type` enum('UNKNOWN','BITMAP','DRAWING','AUDIO','VIDEO','MULTIMEDIA','OFFICE','TEXT','EXECUTABLE','ARCHIVE') default NULL,
  `oi_major_mime` enum('unknown','application','audio','image','text','video','message','model','multipart') NOT NULL default 'unknown',
  `oi_minor_mime` varbinary(32) NOT NULL default 'unknown',
  `oi_deleted` tinyint(3) unsigned NOT NULL default '0',
  `oi_sha1` varbinary(32) NOT NULL default '',
  KEY `oi_usertext_timestamp` (`oi_user_text`,`oi_timestamp`),
  KEY `oi_name_timestamp` (`oi_name`,`oi_timestamp`),
  KEY `oi_name_archive_name` (`oi_name`,`oi_archive_name`(14)),
  KEY `oi_sha1` (`oi_sha1`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_oldimage`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_page`
--

CREATE TABLE IF NOT EXISTS `cyw_page` (
  `page_id` int(10) unsigned NOT NULL auto_increment,
  `page_namespace` int(11) NOT NULL,
  `page_title` varbinary(255) NOT NULL,
  `page_restrictions` tinyblob NOT NULL,
  `page_counter` bigint(20) unsigned NOT NULL default '0',
  `page_is_redirect` tinyint(3) unsigned NOT NULL default '0',
  `page_is_new` tinyint(3) unsigned NOT NULL default '0',
  `page_random` double unsigned NOT NULL,
  `page_touched` binary(14) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `page_latest` int(10) unsigned NOT NULL,
  `page_len` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`page_id`),
  UNIQUE KEY `name_title` (`page_namespace`,`page_title`),
  KEY `page_random` (`page_random`),
  KEY `page_len` (`page_len`)
) ENGINE=InnoDB  DEFAULT CHARSET=binary AUTO_INCREMENT=7 ;

--
-- Daten für Tabelle `cyw_page`
--

INSERT INTO `cyw_page` (`page_id`, `page_namespace`, `page_title`, `page_restrictions`, `page_counter`, `page_is_redirect`, `page_is_new`, `page_random`, `page_touched`, `page_latest`, `page_len`) VALUES
(1, 0, 'Main_Page', '', 19, 0, 0, 0.099027368308, '20090508204923', 1, 449),
(2, 8, 'Sidebar', '', 5, 0, 0, 0.897143737253, '20090508214446', 7, 80),
(3, 0, 'Second_Page', '', 8, 0, 1, 0.449531797873, '20090508215728', 9, 4),
(4, 8, 'Sitenotice', '', 1, 0, 1, 0.915625193972, '20090508215209', 8, 25),
(5, 0, 'First_Page', '', 1, 1, 1, 0.178878487172, '20090508215728', 10, 25),
(6, 8, 'Monobook.css', '', 4, 0, 0, 0.628124203358, '20090508220144', 12, 60);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_page_props`
--

CREATE TABLE IF NOT EXISTS `cyw_page_props` (
  `pp_page` int(11) NOT NULL,
  `pp_propname` varbinary(60) NOT NULL,
  `pp_value` blob NOT NULL,
  PRIMARY KEY  (`pp_page`,`pp_propname`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_page_props`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_page_restrictions`
--

CREATE TABLE IF NOT EXISTS `cyw_page_restrictions` (
  `pr_page` int(11) NOT NULL,
  `pr_type` varbinary(60) NOT NULL,
  `pr_level` varbinary(60) NOT NULL,
  `pr_cascade` tinyint(4) NOT NULL,
  `pr_user` int(11) default NULL,
  `pr_expiry` varbinary(14) default NULL,
  `pr_id` int(10) unsigned NOT NULL auto_increment,
  PRIMARY KEY  (`pr_page`,`pr_type`),
  UNIQUE KEY `pr_id` (`pr_id`),
  KEY `pr_typelevel` (`pr_type`,`pr_level`),
  KEY `pr_level` (`pr_level`),
  KEY `pr_cascade` (`pr_cascade`)
) ENGINE=InnoDB DEFAULT CHARSET=binary AUTO_INCREMENT=1 ;

--
-- Daten für Tabelle `cyw_page_restrictions`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_pagelinks`
--

CREATE TABLE IF NOT EXISTS `cyw_pagelinks` (
  `pl_from` int(10) unsigned NOT NULL default '0',
  `pl_namespace` int(11) NOT NULL default '0',
  `pl_title` varbinary(255) NOT NULL default '',
  UNIQUE KEY `pl_from` (`pl_from`,`pl_namespace`,`pl_title`),
  KEY `pl_namespace` (`pl_namespace`,`pl_title`,`pl_from`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_pagelinks`
--

INSERT INTO `cyw_pagelinks` (`pl_from`, `pl_namespace`, `pl_title`) VALUES
(4, 0, 'TOC'),
(5, 0, 'Second_Page');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_protected_titles`
--

CREATE TABLE IF NOT EXISTS `cyw_protected_titles` (
  `pt_namespace` int(11) NOT NULL,
  `pt_title` varbinary(255) NOT NULL,
  `pt_user` int(10) unsigned NOT NULL,
  `pt_reason` tinyblob,
  `pt_timestamp` binary(14) NOT NULL,
  `pt_expiry` varbinary(14) NOT NULL default '',
  `pt_create_perm` varbinary(60) NOT NULL,
  PRIMARY KEY  (`pt_namespace`,`pt_title`),
  KEY `pt_timestamp` (`pt_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_protected_titles`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_querycache`
--

CREATE TABLE IF NOT EXISTS `cyw_querycache` (
  `qc_type` varbinary(32) NOT NULL,
  `qc_value` int(10) unsigned NOT NULL default '0',
  `qc_namespace` int(11) NOT NULL default '0',
  `qc_title` varbinary(255) NOT NULL default '',
  KEY `qc_type` (`qc_type`,`qc_value`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_querycache`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_querycache_info`
--

CREATE TABLE IF NOT EXISTS `cyw_querycache_info` (
  `qci_type` varbinary(32) NOT NULL default '',
  `qci_timestamp` binary(14) NOT NULL default '19700101000000',
  UNIQUE KEY `qci_type` (`qci_type`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_querycache_info`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_querycachetwo`
--

CREATE TABLE IF NOT EXISTS `cyw_querycachetwo` (
  `qcc_type` varbinary(32) NOT NULL,
  `qcc_value` int(10) unsigned NOT NULL default '0',
  `qcc_namespace` int(11) NOT NULL default '0',
  `qcc_title` varbinary(255) NOT NULL default '',
  `qcc_namespacetwo` int(11) NOT NULL default '0',
  `qcc_titletwo` varbinary(255) NOT NULL default '',
  KEY `qcc_type` (`qcc_type`,`qcc_value`),
  KEY `qcc_title` (`qcc_type`,`qcc_namespace`,`qcc_title`),
  KEY `qcc_titletwo` (`qcc_type`,`qcc_namespacetwo`,`qcc_titletwo`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_querycachetwo`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_recentchanges`
--

CREATE TABLE IF NOT EXISTS `cyw_recentchanges` (
  `rc_id` int(11) NOT NULL auto_increment,
  `rc_timestamp` varbinary(14) NOT NULL default '',
  `rc_cur_time` varbinary(14) NOT NULL default '',
  `rc_user` int(10) unsigned NOT NULL default '0',
  `rc_user_text` varbinary(255) NOT NULL,
  `rc_namespace` int(11) NOT NULL default '0',
  `rc_title` varbinary(255) NOT NULL default '',
  `rc_comment` varbinary(255) NOT NULL default '',
  `rc_minor` tinyint(3) unsigned NOT NULL default '0',
  `rc_bot` tinyint(3) unsigned NOT NULL default '0',
  `rc_new` tinyint(3) unsigned NOT NULL default '0',
  `rc_cur_id` int(10) unsigned NOT NULL default '0',
  `rc_this_oldid` int(10) unsigned NOT NULL default '0',
  `rc_last_oldid` int(10) unsigned NOT NULL default '0',
  `rc_type` tinyint(3) unsigned NOT NULL default '0',
  `rc_moved_to_ns` tinyint(3) unsigned NOT NULL default '0',
  `rc_moved_to_title` varbinary(255) NOT NULL default '',
  `rc_patrolled` tinyint(3) unsigned NOT NULL default '0',
  `rc_ip` varbinary(40) NOT NULL default '',
  `rc_old_len` int(11) default NULL,
  `rc_new_len` int(11) default NULL,
  `rc_deleted` tinyint(3) unsigned NOT NULL default '0',
  `rc_logid` int(10) unsigned NOT NULL default '0',
  `rc_log_type` varbinary(255) default NULL,
  `rc_log_action` varbinary(255) default NULL,
  `rc_params` blob,
  PRIMARY KEY  (`rc_id`),
  KEY `rc_timestamp` (`rc_timestamp`),
  KEY `rc_namespace_title` (`rc_namespace`,`rc_title`),
  KEY `rc_cur_id` (`rc_cur_id`),
  KEY `new_name_timestamp` (`rc_new`,`rc_namespace`,`rc_timestamp`),
  KEY `rc_ip` (`rc_ip`),
  KEY `rc_ns_usertext` (`rc_namespace`,`rc_user_text`),
  KEY `rc_user_text` (`rc_user_text`,`rc_timestamp`)
) ENGINE=InnoDB  DEFAULT CHARSET=binary AUTO_INCREMENT=11 ;

--
-- Daten für Tabelle `cyw_recentchanges`
--

INSERT INTO `cyw_recentchanges` (`rc_id`, `rc_timestamp`, `rc_cur_time`, `rc_user`, `rc_user_text`, `rc_namespace`, `rc_title`, `rc_comment`, `rc_minor`, `rc_bot`, `rc_new`, `rc_cur_id`, `rc_this_oldid`, `rc_last_oldid`, `rc_type`, `rc_moved_to_ns`, `rc_moved_to_title`, `rc_patrolled`, `rc_ip`, `rc_old_len`, `rc_new_len`, `rc_deleted`, `rc_logid`, `rc_log_type`, `rc_log_action`, `rc_params`) VALUES
(1, '20090508214118', '20090508214118', 1, 'Admin', 8, 'Sidebar', 'Created page with ''* navigation ** mainpage|mainpage-description ** portal-url|portal ** currentevents-url|currentevents ** recentchanges-url|recentchanges ** randompage-url|randompage ** helppage|...''', 0, 0, 1, 2, 2, 0, 1, 0, '', 1, '127.0.0.1', 0, 218, 0, 0, NULL, '', ''),
(2, '20090508214211', '20090508214211', 1, 'Admin', 8, 'Sidebar', '', 0, 0, 0, 2, 3, 2, 0, 0, '', 1, '127.0.0.1', 218, 44, 0, 0, NULL, '', ''),
(3, '20090508214228', '20090508214228', 1, 'Admin', 8, 'Sidebar', '', 0, 0, 0, 2, 4, 3, 0, 0, '', 1, '127.0.0.1', 44, 60, 0, 0, NULL, '', ''),
(4, '20090508214313', '20090508214313', 1, 'Admin', 0, 'First_Page', 'Created page with ''Test''', 0, 0, 1, 3, 5, 0, 1, 0, '', 1, '127.0.0.1', 0, 4, 0, 0, NULL, '', ''),
(5, '20090508214415', '20090508214415', 1, 'Admin', 8, 'Sidebar', '', 0, 0, 0, 2, 6, 4, 0, 0, '', 1, '127.0.0.1', 60, 67, 0, 0, NULL, '', ''),
(6, '20090508214446', '20090508214446', 1, 'Admin', 8, 'Sidebar', '', 0, 0, 0, 2, 7, 6, 0, 0, '', 1, '127.0.0.1', 67, 80, 0, 0, NULL, '', ''),
(7, '20090508215209', '20090508215209', 1, 'Admin', 8, 'Sitenotice', 'Created page with ''[[TOC|Table of Contents]]''', 0, 0, 1, 4, 8, 0, 1, 0, '', 1, '127.0.0.1', 0, 25, 0, 0, NULL, '', ''),
(8, '20090508215728', '20090508215728', 1, 'Admin', 0, 'First_Page', '', 0, 0, 0, 5, 0, 0, 3, 0, '', 1, '127.0.0.1', NULL, NULL, 0, 8, 'move', 'move', 0x5365636f6e6420506167650a),
(9, '20090508215953', '20090508215953', 1, 'Admin', 8, 'Monobook.css', 'Created page with ''/* CSS placed here will affect users of the Monobook skin */ #ca-talk { display:none!important; }''', 0, 0, 1, 6, 11, 0, 1, 0, '', 1, '127.0.0.1', 0, 97, 0, 0, NULL, '', ''),
(10, '20090508220144', '20090508220144', 1, 'Admin', 8, 'Monobook.css', '', 0, 0, 0, 6, 12, 11, 0, 0, '', 1, '127.0.0.1', 97, 60, 0, 0, NULL, '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_redirect`
--

CREATE TABLE IF NOT EXISTS `cyw_redirect` (
  `rd_from` int(10) unsigned NOT NULL default '0',
  `rd_namespace` int(11) NOT NULL default '0',
  `rd_title` varbinary(255) NOT NULL default '',
  PRIMARY KEY  (`rd_from`),
  KEY `rd_ns_title` (`rd_namespace`,`rd_title`,`rd_from`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_redirect`
--

INSERT INTO `cyw_redirect` (`rd_from`, `rd_namespace`, `rd_title`) VALUES
(5, 0, 'Second_Page');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_revision`
--

CREATE TABLE IF NOT EXISTS `cyw_revision` (
  `rev_id` int(10) unsigned NOT NULL auto_increment,
  `rev_page` int(10) unsigned NOT NULL,
  `rev_text_id` int(10) unsigned NOT NULL,
  `rev_comment` tinyblob NOT NULL,
  `rev_user` int(10) unsigned NOT NULL default '0',
  `rev_user_text` varbinary(255) NOT NULL default '',
  `rev_timestamp` binary(14) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `rev_minor_edit` tinyint(3) unsigned NOT NULL default '0',
  `rev_deleted` tinyint(3) unsigned NOT NULL default '0',
  `rev_len` int(10) unsigned default NULL,
  `rev_parent_id` int(10) unsigned default NULL,
  PRIMARY KEY  (`rev_page`,`rev_id`),
  UNIQUE KEY `rev_id` (`rev_id`),
  KEY `rev_timestamp` (`rev_timestamp`),
  KEY `page_timestamp` (`rev_page`,`rev_timestamp`),
  KEY `user_timestamp` (`rev_user`,`rev_timestamp`),
  KEY `usertext_timestamp` (`rev_user_text`,`rev_timestamp`)
) ENGINE=InnoDB  DEFAULT CHARSET=binary MAX_ROWS=10000000 AVG_ROW_LENGTH=1024 AUTO_INCREMENT=13 ;

--
-- Daten für Tabelle `cyw_revision`
--

INSERT INTO `cyw_revision` (`rev_id`, `rev_page`, `rev_text_id`, `rev_comment`, `rev_user`, `rev_user_text`, `rev_timestamp`, `rev_minor_edit`, `rev_deleted`, `rev_len`, `rev_parent_id`) VALUES
(1, 1, 1, '', 0, 'MediaWiki default', '20090428082955', 0, 0, 449, 0),
(2, 2, 2, 0x437265617465642070616765207769746820272a206e617669676174696f6e202a2a206d61696e706167657c6d61696e706167652d6465736372697074696f6e202a2a20706f7274616c2d75726c7c706f7274616c202a2a2063757272656e746576656e74732d75726c7c63757272656e746576656e7473202a2a20726563656e746368616e6765732d75726c7c726563656e746368616e676573202a2a2072616e646f6d706167652d75726c7c72616e646f6d70616765202a2a2068656c70706167657c2e2e2e27, 1, 'Admin', '20090508214118', 0, 0, 218, 0),
(3, 2, 3, '', 1, 'Admin', '20090508214211', 0, 0, 44, 2),
(4, 2, 4, '', 1, 'Admin', '20090508214228', 0, 0, 60, 3),
(6, 2, 6, '', 1, 'Admin', '20090508214415', 0, 0, 67, 4),
(7, 2, 7, '', 1, 'Admin', '20090508214446', 0, 0, 80, 6),
(5, 3, 5, 0x437265617465642070616765207769746820275465737427, 1, 'Admin', '20090508214313', 0, 0, 4, 0),
(9, 3, 5, 0x6d6f766564205b5b466972737420506167655d5d20746f205b5b5365636f6e6420506167655d5d, 1, 'Admin', '20090508215728', 1, 0, 4, 5),
(8, 4, 8, 0x437265617465642070616765207769746820275b5b544f437c5461626c65206f6620436f6e74656e74735d5d27, 1, 'Admin', '20090508215209', 0, 0, 25, 0),
(10, 5, 9, 0x6d6f766564205b5b466972737420506167655d5d20746f205b5b5365636f6e6420506167655d5d, 1, 'Admin', '20090508215728', 0, 0, 25, 0),
(11, 6, 10, 0x437265617465642070616765207769746820272f2a2043535320706c6163656420686572652077696c6c20616666656374207573657273206f6620746865204d6f6e6f626f6f6b20736b696e202a2f202363612d74616c6b207b20646973706c61793a6e6f6e6521696d706f7274616e743b207d27, 1, 'Admin', '20090508215953', 0, 0, 97, 0),
(12, 6, 11, '', 1, 'Admin', '20090508220144', 0, 0, 60, 11);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_searchindex`
--

CREATE TABLE IF NOT EXISTS `cyw_searchindex` (
  `si_page` int(10) unsigned NOT NULL,
  `si_title` varchar(255) NOT NULL default '',
  `si_text` mediumtext NOT NULL,
  UNIQUE KEY `si_page` (`si_page`),
  FULLTEXT KEY `si_title` (`si_title`),
  FULLTEXT KEY `si_text` (`si_text`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `cyw_searchindex`
--

INSERT INTO `cyw_searchindex` (`si_page`, `si_title`, `si_text`) VALUES
(1, 'main page', '  mediawiki hasu800 been successfully installed.  consult theu800 user''su800 guide foru800 information onu800 using theu800 wiki software. getting started getting started getting started configuration settings list mediawiki faqu800 mediawiki release mailing list '),
(2, 'sidebar', ' navigation first page first page test test search toolbox languages '),
(3, 'second page', ' test '),
(4, 'sitenotice', ' tocu800 table ofu800 contents '),
(5, 'first page', ' '),
(6, 'monobooku82ecssu800', ' cssu800 placed here will affect users ofu800 theu800 monobook skin ');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_site_stats`
--

CREATE TABLE IF NOT EXISTS `cyw_site_stats` (
  `ss_row_id` int(10) unsigned NOT NULL,
  `ss_total_views` bigint(20) unsigned default '0',
  `ss_total_edits` bigint(20) unsigned default '0',
  `ss_good_articles` bigint(20) unsigned default '0',
  `ss_total_pages` bigint(20) default '-1',
  `ss_users` bigint(20) default '-1',
  `ss_active_users` bigint(20) default '-1',
  `ss_admins` int(11) default '-1',
  `ss_images` int(11) default '0',
  UNIQUE KEY `ss_row_id` (`ss_row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_site_stats`
--

INSERT INTO `cyw_site_stats` (`ss_row_id`, `ss_total_views`, `ss_total_edits`, `ss_good_articles`, `ss_total_pages`, `ss_users`, `ss_active_users`, `ss_admins`, `ss_images`) VALUES
(1, 38, 18, 0, 6, 1, -1, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_templatelinks`
--

CREATE TABLE IF NOT EXISTS `cyw_templatelinks` (
  `tl_from` int(10) unsigned NOT NULL default '0',
  `tl_namespace` int(11) NOT NULL default '0',
  `tl_title` varbinary(255) NOT NULL default '',
  UNIQUE KEY `tl_from` (`tl_from`,`tl_namespace`,`tl_title`),
  KEY `tl_namespace` (`tl_namespace`,`tl_title`,`tl_from`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_templatelinks`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_text`
--

CREATE TABLE IF NOT EXISTS `cyw_text` (
  `old_id` int(10) unsigned NOT NULL auto_increment,
  `old_text` mediumblob NOT NULL,
  `old_flags` tinyblob NOT NULL,
  PRIMARY KEY  (`old_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=binary MAX_ROWS=10000000 AVG_ROW_LENGTH=10240 AUTO_INCREMENT=12 ;

--
-- Daten für Tabelle `cyw_text`
--

INSERT INTO `cyw_text` (`old_id`, `old_text`, `old_flags`) VALUES
(1, 0x3c6269673e2727274d6564696157696b6920686173206265656e207375636365737366756c6c7920696e7374616c6c65642e2727273c2f6269673e0a0a436f6e73756c7420746865205b687474703a2f2f6d6574612e77696b696d656469612e6f72672f77696b692f48656c703a436f6e74656e7473205573657227732047756964655d20666f7220696e666f726d6174696f6e206f6e207573696e67207468652077696b6920736f6674776172652e0a0a3d3d2047657474696e672073746172746564203d3d0a2a205b687474703a2f2f7777772e6d6564696177696b692e6f72672f77696b692f4d616e75616c3a436f6e66696775726174696f6e5f73657474696e677320436f6e66696775726174696f6e2073657474696e6773206c6973745d0a2a205b687474703a2f2f7777772e6d6564696177696b692e6f72672f77696b692f4d616e75616c3a464151204d6564696157696b69204641515d0a2a205b68747470733a2f2f6c697374732e77696b696d656469612e6f72672f6d61696c6d616e2f6c697374696e666f2f6d6564696177696b692d616e6e6f756e6365204d6564696157696b692072656c65617365206d61696c696e67206c6973745d, 0x7574662d38),
(2, 0x2a206e617669676174696f6e0a2a2a206d61696e706167657c6d61696e706167652d6465736372697074696f6e0a2a2a20706f7274616c2d75726c7c706f7274616c0a2a2a2063757272656e746576656e74732d75726c7c63757272656e746576656e74730a2a2a20726563656e746368616e6765732d75726c7c726563656e746368616e6765730a2a2a2072616e646f6d706167652d75726c7c72616e646f6d706167650a2a2a2068656c70706167657c68656c700a2a205345415243480a2a20544f4f4c424f580a2a204c414e4755414745530a54657374, 0x7574662d38),
(3, 0x2a206e617669676174696f6e0a0a2a205345415243480a2a20544f4f4c424f580a2a204c414e475541474553, 0x7574662d38),
(4, 0x2a206e617669676174696f6e0a2a2a5b5b466972737420506167655d5d0a2a205345415243480a2a20544f4f4c424f580a2a204c414e475541474553, 0x7574662d38),
(5, 0x54657374, 0x7574662d38),
(6, 0x2a206e617669676174696f6e0a2a2a466972737420506167657c466972737420506167650a2a205345415243480a2a20544f4f4c424f580a2a204c414e475541474553, 0x7574662d38),
(7, 0x2a206e617669676174696f6e0a2a2a466972737420506167657c466972737420506167650a2a2a2a546573747c546573740a2a205345415243480a2a20544f4f4c424f580a2a204c414e475541474553, 0x7574662d38),
(8, 0x5b5b544f437c5461626c65206f6620436f6e74656e74735d5d, 0x7574662d38),
(9, 0x235245444952454354205b5b5365636f6e6420506167655d5d, 0x7574662d38),
(10, 0x2f2a2043535320706c6163656420686572652077696c6c20616666656374207573657273206f6620746865204d6f6e6f626f6f6b20736b696e202a2f0a2363612d74616c6b207b20646973706c61793a6e6f6e6521696d706f7274616e743b207d, 0x7574662d38),
(11, 0x2f2a2043535320706c6163656420686572652077696c6c20616666656374207573657273206f6620746865204d6f6e6f626f6f6b20736b696e202a2f, 0x7574662d38);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_trackbacks`
--

CREATE TABLE IF NOT EXISTS `cyw_trackbacks` (
  `tb_id` int(11) NOT NULL auto_increment,
  `tb_page` int(11) default NULL,
  `tb_title` varbinary(255) NOT NULL,
  `tb_url` blob NOT NULL,
  `tb_ex` blob,
  `tb_name` varbinary(255) default NULL,
  PRIMARY KEY  (`tb_id`),
  KEY `tb_page` (`tb_page`)
) ENGINE=InnoDB DEFAULT CHARSET=binary AUTO_INCREMENT=1 ;

--
-- Daten für Tabelle `cyw_trackbacks`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_transcache`
--

CREATE TABLE IF NOT EXISTS `cyw_transcache` (
  `tc_url` varbinary(255) NOT NULL,
  `tc_contents` blob,
  `tc_time` int(11) NOT NULL,
  UNIQUE KEY `tc_url_idx` (`tc_url`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_transcache`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_updatelog`
--

CREATE TABLE IF NOT EXISTS `cyw_updatelog` (
  `ul_key` varbinary(255) NOT NULL,
  PRIMARY KEY  (`ul_key`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_updatelog`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_user`
--

CREATE TABLE IF NOT EXISTS `cyw_user` (
  `user_id` int(10) unsigned NOT NULL auto_increment,
  `user_name` varbinary(255) NOT NULL default '',
  `user_real_name` varbinary(255) NOT NULL default '',
  `user_password` tinyblob NOT NULL,
  `user_newpassword` tinyblob NOT NULL,
  `user_newpass_time` binary(14) default NULL,
  `user_email` tinyblob NOT NULL,
  `user_options` blob NOT NULL,
  `user_touched` binary(14) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `user_token` binary(32) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  `user_email_authenticated` binary(14) default NULL,
  `user_email_token` binary(32) default NULL,
  `user_email_token_expires` binary(14) default NULL,
  `user_registration` binary(14) default NULL,
  `user_editcount` int(11) default NULL,
  PRIMARY KEY  (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `user_email_token` (`user_email_token`)
) ENGINE=InnoDB  DEFAULT CHARSET=binary AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `cyw_user`
--

INSERT INTO `cyw_user` (`user_id`, `user_name`, `user_real_name`, `user_password`, `user_newpassword`, `user_newpass_time`, `user_email`, `user_options`, `user_touched`, `user_token`, `user_email_authenticated`, `user_email_token`, `user_email_token_expires`, `user_registration`, `user_editcount`) VALUES
(1, 'Admin', '', 0x3a423a63326332396663333a3432663432623838303164353135393134316437313436356230653935363531, '', NULL, '', 0x717569636b6261723d310a756e6465726c696e653d320a636f6c733d38300a726f77733d32350a7365617263686c696d69743d32300a636f6e746578746c696e65733d350a636f6e7465787463686172733d35300a64697361626c65737567676573743d0a736b696e3d6d6f6e6f626f6f6b0a6d6174683d310a7573656e657772633d300a7263646179733d370a72636c696d69743d35300a776c6c696d69743d3235300a686964656d696e6f723d300a686967686c6967687462726f6b656e3d310a737475627468726573686f6c643d300a707265766965776f6e746f703d310a707265766965776f6e66697273743d300a6564697473656374696f6e3d310a6564697473656374696f6e6f6e7269676874636c69636b3d300a656469746f6e64626c636c69636b3d300a6564697477696474683d300a73686f77746f633d310a73686f77746f6f6c6261723d310a6d696e6f7264656661756c743d300a646174653d64656661756c740a696d61676573697a653d320a7468756d6273697a653d320a72656d656d62657270617373776f72643d300a6e6f63616368653d300a646966666f6e6c793d300a73686f7768696464656e636174733d300a6e6f726f6c6c6261636b646966663d300a656e6f74696677617463686c69737470616765733d300a656e6f7469667573657274616c6b70616765733d300a656e6f7469666d696e6f7265646974733d300a656e6f74696672657665616c616464723d300a73686f776e756d626572737761746368696e673d300a66616e63797369673d300a65787465726e616c656469746f723d300a65787465726e616c646966663d300a666f7263656564697473756d6d6172793d300a73686f776a756d706c696e6b733d310a6a7573746966793d300a6e756d62657268656164696e67733d300a7573656c697665707265766965773d300a77617463686c697374646179733d330a657874656e6477617463686c6973743d300a77617463686c697374686964656d696e6f723d300a77617463686c69737468696465626f74733d300a77617463686c697374686964656f776e3d300a77617463686c69737468696465616e6f6e733d300a77617463686c697374686964656c69753d300a77617463686372656174696f6e733d300a776174636864656661756c743d300a77617463686d6f7665733d300a776174636864656c6574696f6e3d300a6e6f636f6e766572746c696e6b3d300a76617269616e743d0a6c616e67756167653d656e0a7365617263684e73303d310a6e69636b6e616d653d0a74696d65636f7272656374696f6e3d53797374656d7c0a7365617263684e73313d300a7365617263684e73323d300a7365617263684e73333d300a7365617263684e73343d300a7365617263684e73353d300a7365617263684e73363d300a7365617263684e73373d300a7365617263684e73383d300a7365617263684e73393d300a7365617263684e7331303d300a7365617263684e7331313d300a7365617263684e7331323d300a7365617263684e7331333d300a7365617263684e7331343d300a7365617263684e7331353d300a63636d656f6e656d61696c733d30, '20090508220149', '2410b5437100147510fe3e4c894ff885', NULL, '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0', NULL, '20090428082955', 9);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_user_groups`
--

CREATE TABLE IF NOT EXISTS `cyw_user_groups` (
  `ug_user` int(10) unsigned NOT NULL default '0',
  `ug_group` varbinary(16) NOT NULL default '',
  PRIMARY KEY  (`ug_user`,`ug_group`),
  KEY `ug_group` (`ug_group`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_user_groups`
--

INSERT INTO `cyw_user_groups` (`ug_user`, `ug_group`) VALUES
(1, 'bureaucrat'),
(1, 'sysop');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_user_newtalk`
--

CREATE TABLE IF NOT EXISTS `cyw_user_newtalk` (
  `user_id` int(11) NOT NULL default '0',
  `user_ip` varbinary(40) NOT NULL default '',
  `user_last_timestamp` binary(14) NOT NULL default '\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
  KEY `user_id` (`user_id`),
  KEY `user_ip` (`user_ip`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_user_newtalk`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cyw_watchlist`
--

CREATE TABLE IF NOT EXISTS `cyw_watchlist` (
  `wl_user` int(10) unsigned NOT NULL,
  `wl_namespace` int(11) NOT NULL default '0',
  `wl_title` varbinary(255) NOT NULL default '',
  `wl_notificationtimestamp` varbinary(14) default NULL,
  UNIQUE KEY `wl_user` (`wl_user`,`wl_namespace`,`wl_title`),
  KEY `namespace_title` (`wl_namespace`,`wl_title`)
) ENGINE=InnoDB DEFAULT CHARSET=binary;

--
-- Daten für Tabelle `cyw_watchlist`
--

