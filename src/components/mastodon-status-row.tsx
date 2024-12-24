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
    isLoading
}: {
    status: MastodonStatus;
    isLoading: boolean;
}) {
    const post = status.content;
    const { data: crimTitle } = useCriminalizeTitle({ post, wait: isLoading });
    const { data: crimVenue } = useCriminalizeVenue({ post, wait: isLoading });
    return(
        <Tr key={status.id}>
          <Td>{
                (!crimTitle || !crimVenue)?
                    <Link href={status.url}>{ parse(truncate(status.content,100)) }</Link>:

                    <VStack alignItems="left">
                    <TextTransition springConfig={presets.wobbly}><Link href={status.url}>
                        { crimTitle.response }
                    </Link></TextTransition>
                    <Text textStyle="sm" color="gray">
                        { crimVenue.response }
                    </Text>
                    </VStack>
              }
          </Td>
          <Td alignItems="left">{formatter.format(status.reblogs_count)}</Td>
          <Td>{new Date(status.created_at).getFullYear()}</Td>
        </Tr>
    );
}
