import { RouteComponentProps } from "@reach/router";
import { toHsla, toRgba } from "color2k";
import React from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { VStack } from "../components/stack";
import { useGlobalState } from "../global-state";
import { colorToHex } from "../utils";

export function Color({
  paletteId = "",
  scaleId = "",
  index = "",
}: RouteComponentProps<{
  paletteId: string;
  scaleId: string;
  index: string;
}>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];
  const scale = palette.scales[scaleId];
  const indexAsNumber = parseInt(index, 10);
  const color = scale.colors[indexAsNumber];

  if (!color) {
    return null;
  }

  const hex = colorToHex(color);

  return (
    <VStack spacing={16} style={{ padding: 16 }}>
      <span>
        {scale.name}.{index}
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        <VStack spacing={4}>
          <label htmlFor="hue" style={{ fontSize: 14 }}>
            H
          </label>
          <Input
            id="hue"
            type="number"
            style={{ width: "100%" }}
            value={color.hue}
            min={0}
            max={360}
            onChange={event => {
              send({
                type: "CHANGE_COLOR_VALUE",
                paletteId,
                scaleId,
                index: indexAsNumber,
                value: {
                  hue: event.target.valueAsNumber || 0,
                },
              });
            }}
          />
        </VStack>
        <VStack spacing={4}>
          <label htmlFor="saturation" style={{ fontSize: 14 }}>
            S
          </label>
          <Input
            id="saturation"
            type="number"
            style={{ width: "100%" }}
            value={color.saturation}
            min={0}
            max={100}
            onChange={event => {
              send({
                type: "CHANGE_COLOR_VALUE",
                paletteId,
                scaleId,
                index: indexAsNumber,
                value: {
                  saturation: event.target.valueAsNumber || 0,
                },
              });
            }}
          />
        </VStack>
        <VStack spacing={4}>
          <label htmlFor="lightness" style={{ fontSize: 14 }}>
            L
          </label>
          <Input
            id="lightness"
            type="number"
            style={{ width: "100%" }}
            value={color.lightness}
            min={0}
            max={100}
            onChange={event => {
              send({
                type: "CHANGE_COLOR_VALUE",
                paletteId,
                scaleId,
                index: indexAsNumber,
                value: {
                  lightness: event.target.valueAsNumber || 0,
                },
              });
            }}
          />
        </VStack>
      </div>

      <code>{hex}</code>

      <code>{toRgba(hex)}</code>

      <code>{toHsla(hex)}</code>

      <Button
        onClick={() =>
          send({
            type: "DELETE_COLOR",
            paletteId,
            scaleId,
            index: parseInt(index),
          })
        }
      >
        Delete color
      </Button>
    </VStack>
  );
}
