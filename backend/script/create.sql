CREATE TABLE `dashboard` (
`rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `code` varchar(20) NOT NULL COMMENT '종목 코드',
  `name` varchar(100) NOT NULL COMMENT '종목 이름',
  `kcount` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매수량',
  `kprice` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매수금액',
  `ecount` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매도량',
  `eprice` int(12) DEFAULT 0 COMMENT '현재 종목의 총 매도 금액',
  `sprice` int(12) DEFAULT 0 COMMENT '현재 종목의 매도에 대한 아이템의 매수 금액',
  `showyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '화면에 표시 유무',
  `utime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 최초 등록 시간',
  PRIMARY KEY (`rowid`),
  UNIQUE KEY `stockid_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


CREATE TABLE `keeps` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `code` varchar(20) DEFAULT 'NULL' NOT NULL COMMENT '종목 코드',
  `stockid` bigint(12) DEFAULT NULL,
  `scost` int(12) DEFAULT 0 COMMENT '매수단가',
  `sdate` varchar(8) DEFAULT null COMMENT '매수일',
  `count` int(12) DEFAULT 0 COMMENT '매수량',
  `utime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '데이터 최초 등록 시간',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


CREATE TABLE `sells` (
  `rowid` int(12) NOT NULL AUTO_INCREMENT COMMENT '아이디',
  `stockid` bigint(12) NOT NULL COMMENT '주식 메인 테이블 아이디',
  `code` varchar(20) DEFAULT 'NULL' NOT NULL COMMENT '종목 코드',
  `scost` int(12) NOT NULL COMMENT '매수단가',
  `sdate` varchar(8) NOT NULL COMMENT '매수일',
  `ecost` int(12) NOT NULL COMMENT '매도단가',
  `edate` varchar(8) NOT NULL DEFAULT '' COMMENT '매도일',
  `count` int(12) DEFAULT '0' COMMENT '매수/매도량',
  `utime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 수정 시간(데이터 최초 등록시 stime과 동일)',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 최초 등록 시간',
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;