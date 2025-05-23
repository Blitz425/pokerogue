import { BattlerIndex } from "#app/battle";
import { PokemonType } from "#enums/pokemon-type";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import GameManager from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";

describe("Moves - Electrify", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .moveset(Moves.ELECTRIFY)
      .battleStyle("single")
      .startingLevel(100)
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.TACKLE)
      .enemyLevel(100);
  });

  it("should convert attacks to Electric type", async () => {
    await game.classicMode.startBattle([Species.EXCADRILL]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveType");

    game.move.select(Moves.ELECTRIFY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemyPokemon.getMoveType).toHaveLastReturnedWith(PokemonType.ELECTRIC);
    expect(playerPokemon.hp).toBe(playerPokemon.getMaxHp());
  });

  it("should override type changes from abilities", async () => {
    game.override.enemyAbility(Abilities.PIXILATE);

    await game.classicMode.startBattle([Species.EXCADRILL]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveType");

    game.move.select(Moves.ELECTRIFY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemyPokemon.getMoveType).toHaveLastReturnedWith(PokemonType.ELECTRIC);
    expect(playerPokemon.hp).toBe(playerPokemon.getMaxHp());
  });
});
