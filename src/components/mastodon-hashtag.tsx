import { MastodonTag } from "@/types";
import { Link,Text } from "@chakra-ui/react";

export default function MastodonHashtag({
	tag,
}: {
	tag: MastodonTag;
}) {
	return (
	    <Link href={tag.url}><Text>{"#" + tag.name}</Text></Link>
        );
};
