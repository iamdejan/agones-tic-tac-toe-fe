import { createContext, PropsWithChildren, useContext, useState } from 'react';

export interface Player {
  player: string;
  character: string;
}

export interface Point {
  row: number;
  col: number;
}

export type Move = Point & {
  character: string;
};

export interface Event {
  name: string;
  payload: (Player & Move) | undefined;
}

interface Context {
  event?: Event;
  setEvent: (_: Event) => void;
}

const EventContext = createContext<Context>({ setEvent: (_: Event) => {} });

function EventProvider(props: PropsWithChildren<unknown>): JSX.Element {
  const [event, setEvent] = useState<Event>();

  return <EventContext.Provider value={{ event, setEvent }} {...props} />;
}

export const useEvent: () => Context = () => useContext(EventContext);

export default EventProvider;
