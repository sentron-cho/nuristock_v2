import { ST } from "@shared/config/kor.lang";
import Flex from "./Flex";
import { Text } from "./Text";

export const NoData = () => {
  return (
    <Flex height={'100%'} justify={'center'}>
      <Text size='lg' text={ST.NO_HISTORY} color='textDisabled' />
    </Flex>
  );
};