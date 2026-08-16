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
    rank,
    onCrimeStatus
}: {
    status: MastodonStatus;
    isLoading: boolean;
    crimeMode: boolean;
    rank: number;
    onCrimeStatus?: (id: string, status: { loading: boolean; error: boolean }) => void;
}) {
    const hasBodyText = status.content.replace(/<[^>]*>/g, "").trim().length > 0;
    const content = hasBodyText
        ? status.content
        : status.media_attachments
              .filter(m => m.type === "image" && m.description)
              .map(m => m.description)
              .join(" ") || status.content;

    const post: string = content;
    const { data: crimTitle, error: crimTitleError, isLoading: isCrimTitleLoading } = useCriminalizeTitle({ post, wait: isLoading, enable: crimeMode, id: status.id, priority: rank });
    const { data: crimVenue, error: crimVenueError, isLoading: isCrimVenueLoading } = useCriminalizeVenue({ post, wait: isLoading, enable: crimeMode, id: status.id, priority: rank });

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
                    <Link target="_blank" href={status.url}>{ parse(truncate(content,100)) }</Link>:

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
          <Td isNumeric>{formatter.format(status.reblogs_count)}</Td>
          <Td>{new Date(status.created_at).getFullYear()}</Td>
        </Tr>
    );
}
