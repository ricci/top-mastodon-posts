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
import { useEffect } from "react";

const formatter = new Intl.NumberFormat();

export default function MastodonStatusRow({
    status,
    isLoading,
    crimeMode,
    onCrimeStatus
}: {
    status: MastodonStatus;
    isLoading: boolean;
    crimeMode: boolean;
    onCrimeStatus?: (id: string, status: { loading: boolean; error: boolean }) => void;
}) {
    const post: string = status.content;
    const { data: crimTitle, error: crimTitleError, isLoading: isCrimTitleLoading } = useCriminalizeTitle({ post, wait: isLoading, enable: crimeMode });
    const { data: crimVenue, error: crimVenueError, isLoading: isCrimVenueLoading } = useCriminalizeVenue({ post, wait: isLoading, enable: crimeMode });

    useEffect(() => {
        if (crimeMode) {
            onCrimeStatus?.(status.id, {
                loading: isCrimTitleLoading || isCrimVenueLoading,
                error: !!(crimTitleError || crimVenueError),
            });
        }
    }, [crimeMode, status.id, isCrimTitleLoading, isCrimVenueLoading, crimTitleError, crimVenueError, onCrimeStatus]);

    return(
        <Tr key={status.id}>
          <Td>{
                (!crimTitle || !crimVenue)?
                    <Link target="_blank" href={status.url}>{ parse(truncate(status.content,100)) }</Link>:

                    <VStack alignItems="left">
                    <Link target="_blank"  href={status.url}>
                        { crimTitle.response }
                    </Link>
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
