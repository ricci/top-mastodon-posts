import { MastodonStatus } from "@/types";
import {
    Tr,
    Td,
    Link,
    VStack,
    Text
} from "@chakra-ui/react";
import parse from 'html-react-parser';
import truncate from 'truncate-html';
import { useCriminalizeTitle, useCriminalizeVenue } from "@/hooks";
import TextTransition, { presets } from 'react-text-transition';

const formatter = new Intl.NumberFormat();

export default function MastodonStatusRow({
    status,
    isLoading,
    crimeMode
}: {
    status: MastodonStatus;
    isLoading: boolean;
    crimeMode: boolean;
}) {
    const post: string = status.content;
    const { data: crimTitle } = useCriminalizeTitle({ post, wait: isLoading, enable: crimeMode });
    const { data: crimVenue } = useCriminalizeVenue({ post, wait: isLoading, enable: crimeMode });
    return(
        <Tr key={status.id}>
          <Td>{
                (!crimTitle || !crimVenue)?
                    <Link href={status.url}>{ parse(truncate(status.content,100)) }</Link>:

                    <VStack alignItems="left">
                    <Link href={status.url}>
                        { crimTitle.resp.response }
                    </Link>
                    <Text textStyle="sm" color="gray">
                        { crimVenue.resp.response }
                    </Text>
                    </VStack>
              }
          </Td>
          <Td alignItems="left">{formatter.format(status.reblogs_count)}</Td>
          <Td>{new Date(status.created_at).getFullYear()}</Td>
        </Tr>
    );
}
