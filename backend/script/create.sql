-- nuristock_v2.app definition

CREATE TABLE `app` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `sgroup` varchar(20) NOT NULL DEFAULT 'app' COMMENT '그룹',
  `skey` varchar(20) NOT NULL COMMENT '키',
  `svalue` varchar(100) NOT NULL COMMENT '값',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


-- nuristock_v2.asset definition

CREATE TABLE `asset` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `sdate` varchar(20) NOT NULL COMMENT '년월일',
  `price` int(12) NOT NULL COMMENT '투자총액',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=356 DEFAULT CHARSET=utf8 COMMENT='일 또는 월별 투자금액';


-- nuristock_v2.dashboard definition

CREATE TABLE `dashboard` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `code` varchar(20) NOT NULL COMMENT '종목 코드',
  `name` varchar(100) NOT NULL COMMENT '종목 이름',
  `kcount` int(12) DEFAULT '0' COMMENT '현재 종목의 총 매수량',
  `kprice` int(12) DEFAULT '0' COMMENT '현재 종목의 총 매수금액',
  `ecount` int(12) DEFAULT '0' COMMENT '현재 종목의 총 매도량',
  `eprice` int(12) DEFAULT '0' COMMENT '현재 종목의 총 매도 금액',
  `sprice` int(12) DEFAULT '0' COMMENT '현재 종목의 매도에 대한 아이템의 매수 금액',
  `showyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '화면에 표시 유무',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`),
  UNIQUE KEY `stockid_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;


-- nuristock_v2.deposit definition

CREATE TABLE `deposit` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `stype` varchar(20) NOT NULL COMMENT '저장방식',
  `sdate` varchar(20) NOT NULL COMMENT '년월일',
  `price` int(12) NOT NULL COMMENT '금액',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='예수금';


-- nuristock_v2.divid definition

CREATE TABLE `divid` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `code` varchar(20) NOT NULL DEFAULT 'NULL' COMMENT '종목 코드',
  `cost` int(12) NOT NULL COMMENT '주당배당금',
  `count` int(12) DEFAULT '0' COMMENT '배당주식수',
  `sdate` varchar(8) NOT NULL COMMENT '배당일',
  `price` int(12) NOT NULL COMMENT '세후배당총액',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;


-- nuristock_v2.investment definition

CREATE TABLE `investment` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `code` varchar(20) NOT NULL DEFAULT 'NULL' COMMENT '종목 코드',
  `ctype` varchar(20) DEFAULT '',
  `count` varchar(20) DEFAULT '' COMMENT '주식총수',
  `equity` varchar(20) DEFAULT '' COMMENT '자기자본총계',
  `roe` varchar(20) DEFAULT '' COMMENT 'ROE',
  `profit` varchar(20) DEFAULT '' COMMENT '이익',
  `brate` varchar(20) DEFAULT '8.0' COMMENT '예상 성장율(8.0)',
  `rate1` varchar(20) DEFAULT '0.7' COMMENT '기준율(W0.7)',
  `rate2` varchar(20) DEFAULT '0.8' COMMENT '기준율(W0.8)',
  `rate3` varchar(20) DEFAULT '0.9' COMMENT '기준율(W0.9)',
  `rate4` varchar(20) DEFAULT '1.0' COMMENT '기준율(W1.0)',
  `sdate` varchar(12) DEFAULT '' COMMENT '기준일자(년도)',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;


-- nuristock_v2.keeps definition

CREATE TABLE `keeps` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `code` varchar(20) NOT NULL DEFAULT 'NULL' COMMENT '종목 코드',
  `scost` int(12) DEFAULT '0' COMMENT '매수단가',
  `sdate` varchar(8) DEFAULT NULL COMMENT '매수일',
  `count` int(12) DEFAULT '0' COMMENT '매수량',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;


-- nuristock_v2.market definition

CREATE TABLE `market` (
  `code` varchar(20) NOT NULL COMMENT '종목 코드',
  `name` varchar(100) NOT NULL COMMENT '종목 명',
  `type` varchar(10) NOT NULL COMMENT '시장구분',
  `sise` int(12) unsigned DEFAULT '0',
  `updown` varchar(10) DEFAULT NULL COMMENT '전일대비 up/down',
  `erate` float DEFAULT '0' COMMENT '전거래일 등락율',
  `ecost` int(12) DEFAULT '0',
  `state` varchar(45) DEFAULT 'open',
  `stime` varchar(20) DEFAULT NULL COMMENT '시세 업데이트 시간',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- nuristock_v2.marketinfo definition

CREATE TABLE `marketinfo` (
  `code` varchar(20) NOT NULL COMMENT '종목 코드',
  `name` varchar(100) NOT NULL COMMENT '종목 명',
  `scount` bigint(20) unsigned DEFAULT '0' COMMENT '상장주식수',
  `cprice` int(12) unsigned DEFAULT '0' COMMENT '시가총액',
  `fprice` int(12) unsigned DEFAULT '0' COMMENT '액면가',
  `tprice` int(12) unsigned DEFAULT '0' COMMENT '목표가',
  `per` float DEFAULT '0' COMMENT 'per',
  `eps` float DEFAULT '0' COMMENT 'eps',
  `dvr` float DEFAULT '0' COMMENT '배당율',
  `spv` float DEFAULT '0',
  `spva` float DEFAULT '0',
  `prea` int(12) DEFAULT '0' COMMENT '1년전 순이익',
  `preb` int(12) DEFAULT '0' COMMENT '2년전 순이익',
  `prec` int(12) DEFAULT '0' COMMENT '3년전 순이익',
  `cura` int(12) DEFAULT '0' COMMENT '올해 예상 순이익',
  `debta` float DEFAULT '0' COMMENT '1년전 부채율',
  `debtb` float DEFAULT '0' COMMENT '2년전 부채율',
  `debtc` float DEFAULT '0' COMMENT '3년전 부채율',
  `diva` int(12) DEFAULT '0' COMMENT '1년전 배당액',
  `divb` int(12) DEFAULT '0' COMMENT '2년전 배당액',
  `divc` int(12) DEFAULT '0' COMMENT '3년전 배당액',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- nuristock_v2.sells definition

CREATE TABLE `sells` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `code` varchar(20) NOT NULL DEFAULT 'NULL' COMMENT '종목 코드',
  `scost` int(12) NOT NULL COMMENT '매수단가',
  `sdate` varchar(8) NOT NULL COMMENT '매수일',
  `ecost` int(12) NOT NULL COMMENT '매도단가',
  `edate` varchar(8) NOT NULL DEFAULT '' COMMENT '매도일',
  `count` int(12) DEFAULT '0' COMMENT '매수/매도량',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  `utime` timestamp NULL DEFAULT NULL COMMENT '데이터 수정 시간(데이터 최초 등록시 ctime과 동일)',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=398 DEFAULT CHARSET=utf8;