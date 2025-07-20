-- nuristock.dashboard definition

CREATE TABLE `dashboard` (
  `stockid` int(12) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL COMMENT '종목 코드',
  `name` varchar(100) NOT NULL COMMENT '종목 이름',
  `rprice` int(12) unsigned DEFAULT 0 COMMENT '검색 실시간 현재가',
  `rtime` datetime DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `kcount` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매수량',
  `kprice` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매수금액',
  `ecount` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매도량',
  `eprice` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매도 금액',
  `sprice` int(12) DEFAULT 0 COMMENT '현재 종목의 매도에 대한 아이템의 매수 금액',
  `showyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '화면에 표시 유무',
  `utime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 최초 등록 시간',
  UNIQUE KEY `stockid_UNIQUE` (`stockid`)
) ENGINE=InnoDB AUTO_INCREMENT=18446744073709551615 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- nuristock.keeps definition

CREATE TABLE `keeps` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `stockid` int(12) NOT NULL COMMENT '주식 메인 테이블 아이디',
  `scost` int(12) NOT NULL COMMENT '매수 금액',
  `sdate` varchar(8) NOT NULL COMMENT '매수일',
  `count` int(12) NOT NULL COMMENT '매수량',
  `utime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 최초 등록 시간',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- nuristock.market definition

CREATE TABLE `market` (
  `code` varchar(20) NOT NULL COMMENT '종목 코드',
  `name` varchar(100) NOT NULL COMMENT '종목 명',
  `type` varchar(10) NOT NULL COMMENT '시장구분',
  `sise` int(12) unsigned DEFAULT 0,
  `stime` varchar(20) DEFAULT NULL COMMENT '상장일',
  `updown` varchar(10) DEFAULT NULL COMMENT '전일대비 up/down',
  `erate` float DEFAULT 0 COMMENT '전거래일 등락율',
  `ecost` int(12) DEFAULT 0,
  `owner` varchar(100) DEFAULT '' COMMENT '대표자 명',
  `home` varchar(100) DEFAULT '' COMMENT '홈페이지 주소',
  `city` varchar(100) DEFAULT '' COMMENT '지역',
  `state` varchar(45) DEFAULT 'open',
  `summary` text DEFAULT NULL,
  `crtime` bigint(20) DEFAULT 0 COMMENT '마지막 크롤링 시간',
  `vcount` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'view count(이 카운트가 높을수록 우선적으로 시세 반영)',
  `utime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 최초 등록 시간',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- nuristock.marketinfo definition

CREATE TABLE `marketinfo` (
  `code` varchar(20) NOT NULL COMMENT '종목 코드',
  `name` varchar(100) NOT NULL COMMENT '종목 명',
  `scount` bigint(20) unsigned DEFAULT 0 COMMENT '상장주식수',
  `cprice` int(12) unsigned DEFAULT 0 COMMENT '시가총액',
  `fprice` int(12) unsigned DEFAULT 0 COMMENT '액면가',
  `tprice` int(12) unsigned DEFAULT 0 COMMENT '목표가',
  `per` float DEFAULT 0 COMMENT 'per',
  `eps` float DEFAULT 0 COMMENT 'eps',
  `dvr` float DEFAULT 0 COMMENT '배당율',
  `spv` float DEFAULT 0,
  `spva` float DEFAULT 0,
  `prea` int(12) DEFAULT 0 COMMENT '1년전 순이익',
  `preb` int(12) DEFAULT 0 COMMENT '2년전 순이익',
  `prec` int(12) DEFAULT 0 COMMENT '3년전 순이익',
  `cura` int(12) DEFAULT 0 COMMENT '올해 예상 순이익',
  `debta` float DEFAULT 0 COMMENT '1년전 부채율',
  `debtb` float DEFAULT 0 COMMENT '2년전 부채율',
  `debtc` float DEFAULT 0 COMMENT '3년전 부채율',
  `diva` int(12) DEFAULT 0 COMMENT '1년전 배당액',
  `divb` int(12) DEFAULT 0 COMMENT '2년전 배당액',
  `divc` int(12) DEFAULT 0 COMMENT '3년전 배당액',
  `utime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 최초 등록 시간',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- nuristock.sells definition

CREATE TABLE `sells` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `stockid` int(12) NOT NULL COMMENT '주식 메인 테이블 아이디',
  `scost` int(12) NOT NULL COMMENT '매수 금액',
  `sdate` varchar(8) NOT NULL COMMENT '매수일',
  `ecost` int(12) NOT NULL COMMENT '매수 금액',
  `edate` varchar(8) NOT NULL DEFAULT '' COMMENT '매도일',
  `count` int(12) DEFAULT 0 COMMENT '매도량',
  `utime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 최초 등록 시간',
  PRIMARY KEY (`rowid`)
  
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;