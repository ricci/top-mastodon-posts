import { List, ListItem } from "@chakra-ui/react";
import { MastodonStatus } from "@/types";
import {
    HStack,
    Text
} from "@chakra-ui/react";

export default function MastodonProfile({
    statuses
}: {
    statuses: Array<MastodonStatus> | undefined;
}) {
    let bIndex: number = 0;
    let fIndex: number = 0;
    let totalBoosts: number = 0;
    let totalFavs: number = 0;
    // Note: assumes that statuses are sorted
    if (statuses !== undefined) {
        for (const status of statuses){
            totalBoosts += status.reblogs_count;
            totalFavs += status.favourites_count;
            if (bIndex +1 <= status.reblogs_count) {
                bIndex = bIndex +1;
            }
            if (fIndex +1 <= status.favourites_count) {
                fIndex = fIndex +1;
            }
        }
    }
    
    return(<List>
              <ListItem><b>Cited by:</b> {totalBoosts}</ListItem>
              <ListItem><b>b-Index</b>: {bIndex}</ListItem>
              <ListItem><b>f-Index</b>: {fIndex}</ListItem>
           </List>);
}
