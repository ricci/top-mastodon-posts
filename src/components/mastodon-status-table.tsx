import { MastodonStatus, RankingMetric } from "@/types";
import {
    Box,
    HStack,
    Table,
    Text,
    Thead,
    Tbody,
    Tooltip,
    Tr,
    Td
} from "@chakra-ui/react";
import { MastodonStatusRow } from "@/components";
import { constants, metricCount, metricTooltip } from "@/library";
import { LuCircleHelp } from "react-icons/lu";

export default function MastodonStatusTable({
    statuses,
    isLoading,
    crimeMode,
    metric,
    onToggleMetric,
    extra,
    crimesProgress,
    onCrimeStatus
}: {
    statuses: Array<MastodonStatus> | undefined;
    isLoading: boolean;
    crimeMode: boolean;
    metric: RankingMetric;
    onToggleMetric: () => void;
    extra: any;
    crimesProgress?: any;
    onCrimeStatus?: (id: string, status: { loading: boolean; error: boolean }) => void;
}) {
    return(
        <Table>
            <Thead>
                <Tr>
                  <Td><Text>Title {extra}</Text></Td>
                  <Td isNumeric>
                      <Tooltip label={metricTooltip(metric)}>
                          <HStack gap={1} display="inline-flex" cursor="pointer" onClick={onToggleMetric}>
                              <Text>Citations</Text>
                              <Box as="span" display="inline-flex"><LuCircleHelp size={14} /></Box>
                          </HStack>
                      </Tooltip>
                  </Td>
                  <Td>Year</Td>
                </Tr>
                {crimesProgress && (
                    <Tr>
                      <Td colSpan={3}>{crimesProgress}</Td>
                    </Tr>
                )}
            </Thead>
            <Tbody>
                {statuses && statuses.sort((a,b) => metricCount(b, metric) - metricCount(a, metric)).slice(0,constants.maxDisplayedStatuses).map((x, rank) => <MastodonStatusRow key={x.id} status={x} isLoading={isLoading} crimeMode={crimeMode} metric={metric} rank={rank} onCrimeStatus={onCrimeStatus}/>)}
            </Tbody>
        </Table>
    );
}
