import { MastodonTag } from "@/types";
import { Text } from "@chakra-ui/react";
import { InlineLink } from "@/components";

export default function MastodonHashtag({
	tag,
}: {
	tag: MastodonTag;
}) {
	return (
	    <InlineLink href={tag.url}><Text>{"#" + tag.name}</Text></InlineLink>
        );
};
