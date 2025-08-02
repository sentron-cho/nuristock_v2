import { styled } from "@styles/stitches.config";
import { Typography } from "@mui/material";
import Flex from "@entites/Flex";

const Container = styled("div", {
  marginTop: 16,
  padding: 12,
  backgroundColor: "#1d1d1d",
  borderRadius: 8,
});

export const ContentsView = () => {
  return (
    <Container>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        📌 거래 상세 정보 (예시)
      </Typography>
      <Flex direction="column" gap={2}>
        <Typography variant="body2">매수 - 현대차 200,000 × 10 = 2,000,000원</Typography>
        <Typography variant="body2">매수 - 기아 100,000 × 10 = 1,000,000원</Typography>
        <Typography variant="body2">매도 - 대한항공 200,000 × 10 = 2,000,000원</Typography>
        <Typography variant="body2">매도 - 기아 100,000 × 10 = 1,000,000원</Typography>
      </Flex>
    </Container>
  );
};
