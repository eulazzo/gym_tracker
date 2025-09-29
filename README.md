# GymTrackerPro - Documentação do Backend (.NET + Clean Architecture)

## 📊 **Visão Geral do Sistema**

O GymTrackerPro é uma aplicação web para:
- **Registro de treinos** com exercícios, séries, pesos e repetições
- **Acompanhamento de progresso** com métricas corporais
- **Gestão de metas** e objetivos de fitness
- **Biblioteca de exercícios** organizada por grupos musculares
- **Dashboard** com estatísticas e visualizações

## 🏗️ **Arquitetura Limpa - Estrutura do Projeto**

```

GymTrackerPro/
├── src/
│   ├── Core | Shared | GymTrackerPro.Domain/           # Entidades e Regras de Negócio
│   ├── Manager | GymTrackerPro.Application/      # Casos de Uso e Interfaces
│   ├── Data | GymTrackerPro.Infrastructure/   # Implementações (DB, APIs, etc)
│   ├── WebApi | GymTrackerPro.API/             # Controllers e Configurações
│   └── GymTrackerPro.Tests/           # Testes Unitários e Integração
├── docs/
└── scripts/
```

Onde colocar cada coisa:

04.Core (Domain Layer):
✅ Entidades: User, Workout, Exercise, Goal
✅ Value Objects: Email, UserPreferences
✅ Enums: ExerciseType, GoalCategory
✅ Interfaces: IUserRepository, IWorkoutRepository
✅ Exceptions: DomainException

02.Manager (Application Layer):
✅ Use Cases: CreateWorkoutUseCase, LoginUseCase
✅ DTOs: CreateWorkoutRequest, WorkoutResponse
✅ Services: IWorkoutService, IAuthService
✅ Validators: CreateWorkoutValidator
✅ Mappers: WorkoutMapper

03.Data (Infrastructure Layer):
✅ Repositories: UserRepository, WorkoutRepository
✅ DbContext: GymTrackerDbContext
✅ Configurations: UserConfiguration
✅ External Services: JwtService, EmailService

01.WebApi (API Layer):
✅ Controllers: WorkoutController, AuthController
✅ Middlewares: ExceptionMiddleware
✅ Program.cs, appsettings.json

05.Tests:
✅ Testes unitários e de integração


### **Camadas da Arquitetura:**

#### **1. Domain Layer (GymTrackerPro.Domain)**
- **Entities**: User, Workout, Exercise, Goal, etc.
- **Value Objects**: Email, Weight, Duration
- **Enums**: WorkoutType, GoalCategory, ExerciseType
- **Interfaces**: IUserRepository, IWorkoutRepository
- **Domain Services**: WorkoutCalculationService
- **Exceptions**: DomainException, ValidationException

#### **2. Application Layer (GymTrackerPro.Application)**
- **Use Cases**: CreateWorkoutUseCase, GetUserStatsUseCase
- **DTOs**: CreateWorkoutRequest, WorkoutResponse
- **Interfaces**: IWorkoutService, IAuthService
- **Validators**: CreateWorkoutValidator
- **Mappers**: WorkoutMapper

#### **3. Infrastructure Layer (GymTrackerPro.Infrastructure)**
- **Repositories**: UserRepository, WorkoutRepository
- **DbContext**: GymTrackerDbContext
- **External Services**: EmailService, FileStorageService
- **Configurations**: EntityConfigurations

#### **4. API Layer (GymTrackerPro.API)**
- **Controllers**: WorkoutController, AuthController
- **Middlewares**: ExceptionMiddleware, AuthMiddleware
- **Configurations**: Startup, Program
- **DTOs**: API Request/Response models

## 🗄️ **Modelo de Dados e Entidades C#**

### **Entidades do Domain Layer:**

#### **1. User (Usuário)**
```csharp
public class User : BaseEntity
{
    public string Name { get; private set; }
    public Email Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string? AvatarUrl { get; private set; }
    public UserPreferences Preferences { get; private set; }
    public UserGoals Goals { get; private set; }
    
    // Navigation Properties
    public ICollection<Workout> Workouts { get; private set; } = new List<Workout>();
    public ICollection<Exercise> Exercises { get; private set; } = new List<Exercise>();
    public ICollection<Goal> UserGoals { get; private set; } = new List<Goal>();
    public ICollection<BodyMetric> BodyMetrics { get; private set; } = new List<BodyMetric>();
}

public class UserPreferences : ValueObject
{
    public string Theme { get; private set; } = "light";
    public int WeekStartsOn { get; private set; } = 1;
    public int DefaultRestTime { get; private set; } = 90;
    public string Units { get; private set; } = "metric";
}

public class UserGoals : ValueObject
{
    public int WeeklyWorkouts { get; private set; } = 4;
    public decimal? TargetWeight { get; private set; }
    public decimal? TargetBodyFat { get; private set; }
}
```

#### **2. Exercise (Exercício)**
```csharp
public class Exercise : BaseEntity
{
    public Guid UserId { get; private set; }
    public string Name { get; private set; }
    public string MuscleGroup { get; private set; }
    public ExerciseType Type { get; private set; }
    public string? Instructions { get; private set; }
    public string? ImageUrl { get; private set; }
    
    // Navigation Properties
    public User User { get; private set; }
    public ICollection<WorkoutExercise> WorkoutExercises { get; private set; } = new List<WorkoutExercise>();
}

public enum ExerciseType
{
    Strength = 1,
    Cardio = 2,
    Flexibility = 3
}
```

#### **3. Workout (Treino)**
```csharp
public class Workout : BaseEntity
{
    public Guid UserId { get; private set; }
    public DateOnly Date { get; private set; }
    public string Type { get; private set; }
    public int Duration { get; private set; } // em minutos
    public DateTime? StartTime { get; private set; }
    public DateTime? EndTime { get; private set; }
    public string? Notes { get; private set; }
    public bool Completed { get; private set; }
    
    // Navigation Properties
    public User User { get; private set; }
    public ICollection<WorkoutExercise> WorkoutExercises { get; private set; } = new List<WorkoutExercise>();
}
```

#### **4. WorkoutExercise (Exercício do Treino)**
```csharp
public class WorkoutExercise : BaseEntity
{
    public Guid WorkoutId { get; private set; }
    public Guid ExerciseId { get; private set; }
    public string? Notes { get; private set; }
    public bool PersonalRecord { get; private set; }
    public int OrderIndex { get; private set; }
    
    // Navigation Properties
    public Workout Workout { get; private set; }
    public Exercise Exercise { get; private set; }
    public ICollection<WorkoutSet> Sets { get; private set; } = new List<WorkoutSet>();
}
```

#### **5. WorkoutSet (Série)**
```csharp
public class WorkoutSet : BaseEntity
{
    public Guid WorkoutExerciseId { get; private set; }
    public int Reps { get; private set; }
    public decimal Weight { get; private set; }
    public int Rest { get; private set; } // em segundos
    public bool Completed { get; private set; }
    public int OrderIndex { get; private set; }
    
    // Navigation Properties
    public WorkoutExercise WorkoutExercise { get; private set; }
}
```

#### **6. BodyMetric (Métrica Corporal)**
```csharp
public class BodyMetric : BaseEntity
{
    public Guid UserId { get; private set; }
    public DateOnly Date { get; private set; }
    public decimal? Weight { get; private set; }
    public decimal? BodyFat { get; private set; }
    public BodyMeasurements Measurements { get; private set; }
    public ICollection<string> Photos { get; private set; } = new List<string>();
    
    // Navigation Properties
    public User User { get; private set; }
}

public class BodyMeasurements : ValueObject
{
    public decimal? Chest { get; private set; }
    public decimal? Waist { get; private set; }
    public decimal? Hips { get; private set; }
    public decimal? Bicep { get; private set; }
    public decimal? Thigh { get; private set; }
}
```

#### **7. Goal (Meta)**
```csharp
public class Goal : BaseEntity
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public GoalCategory Category { get; private set; }
    public decimal TargetValue { get; private set; }
    public decimal CurrentValue { get; private set; }
    public string Unit { get; private set; }
    public DateOnly Deadline { get; private set; }
    public GoalStatus Status { get; private set; }
    public string? Notes { get; private set; }
    
    // Navigation Properties
    public User User { get; private set; }
    public ICollection<Milestone> Milestones { get; private set; } = new List<Milestone>();
}

public enum GoalCategory
{
    Strength = 1,
    Weight = 2,
    Endurance = 3,
    Flexibility = 4,
    Muscle = 5,
    Other = 6
}

public enum GoalStatus
{
    Active = 1,
    Completed = 2,
    Paused = 3,
    Cancelled = 4
}
```

#### **8. Milestone (Marco)**
```csharp
public class Milestone : BaseEntity
{
    public Guid GoalId { get; private set; }
    public string Title { get; private set; }
    public decimal TargetValue { get; private set; }
    public decimal CurrentValue { get; private set; }
    public bool Completed { get; private set; }
    public DateOnly Deadline { get; private set; }
    
    // Navigation Properties
    public Goal Goal { get; private set; }
}
```

#### **9. BaseEntity (Classe Base)**
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; protected set; } = DateTime.UtcNow;
    
    protected void UpdateTimestamp()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}

public abstract class ValueObject
{
    protected static bool EqualOperator(ValueObject left, ValueObject right)
    {
        if (ReferenceEquals(left, null) ^ ReferenceEquals(right, null))
            return false;
        return ReferenceEquals(left, right) || left.Equals(right);
    }
    
    protected static bool NotEqualOperator(ValueObject left, ValueObject right)
    {
        return !EqualOperator(left, right);
    }
}
```

## 🔗 **Endpoints da API REST**

### **Autenticação**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
PUT  /api/auth/profile
```

### **Usuários**
```
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
GET    /api/users/me/preferences
PUT    /api/users/me/preferences
GET    /api/users/me/goals
PUT    /api/users/me/goals
```

### **Exercícios**
```
GET    /api/exercises
POST   /api/exercises
GET    /api/exercises/:id
PUT    /api/exercises/:id
DELETE /api/exercises/:id
GET    /api/exercises/:id/history
GET    /api/exercises/groups
```

### **Treinos**
```
GET    /api/workouts
POST   /api/workouts
GET    /api/workouts/:id
PUT    /api/workouts/:id
DELETE /api/workouts/:id
GET    /api/workouts/today
GET    /api/workouts/week
GET    /api/workouts/calendar
POST   /api/workouts/:id/start
POST   /api/workouts/:id/complete
```

### **Exercícios do Treino**
```
GET    /api/workouts/:workoutId/exercises
POST   /api/workouts/:workoutId/exercises
GET    /api/workouts/:workoutId/exercises/:id
PUT    /api/workouts/:workoutId/exercises/:id
DELETE /api/workouts/:workoutId/exercises/:id
```

### **Séries**
```
GET    /api/workout-exercises/:id/sets
POST   /api/workout-exercises/:id/sets
PUT    /api/workout-exercises/:id/sets/:setId
DELETE /api/workout-exercises/:id/sets/:setId
```

### **Métricas Corporais**
```
GET    /api/body-metrics
POST   /api/body-metrics
GET    /api/body-metrics/:id
PUT    /api/body-metrics/:id
DELETE /api/body-metrics/:id
GET    /api/body-metrics/latest
GET    /api/body-metrics/weight-progress
```

### **Metas**
```
GET    /api/goals
POST   /api/goals
GET    /api/goals/:id
PUT    /api/goals/:id
DELETE /api/goals/:id
PUT    /api/goals/:id/progress
GET    /api/goals/active
GET    /api/goals/completed
```

### **Marcos**
```
GET    /api/goals/:goalId/milestones
POST   /api/goals/:goalId/milestones
PUT    /api/goals/:goalId/milestones/:id
DELETE /api/goals/:goalId/milestones/:id
```

### **Dashboard e Estatísticas**
```
GET    /api/dashboard/stats
GET    /api/dashboard/progress
GET    /api/dashboard/frequency
GET    /api/dashboard/volume
```

## 🔐 **Sistema de Autenticação**

### **JWT Token Strategy:**
- **Access Token**: 15 minutos de duração
- **Refresh Token**: 7 dias de duração
- **Algoritmo**: HS256
- **Claims**: `{ userId, email, iat, exp }`

### **Middleware de Autenticação:**
```typescript
interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}
```

## 📋 **Regras de Negócio**

### **1. Validações de Treino:**
- Um usuário não pode ter mais de 1 treino por dia
- Duração mínima: 5 minutos, máxima: 300 minutos
- Peso mínimo: 0kg, máximo: 1000kg
- Repetições mínimas: 1, máximas: 1000

### **2. Validações de Métricas:**
- Peso: 30kg - 300kg
- % Gordura: 3% - 50%
- Medidas: 10cm - 200cm

### **3. Validações de Metas:**
- Prazo mínimo: 1 semana
- Prazo máximo: 2 anos
- Valor alvo deve ser maior que valor atual

### **4. Cálculos Automáticos:**
- **1RM**: Fórmula de Epley `weight * (1 + reps / 30)`
- **Volume Total**: Soma de (peso × repetições) de todas as séries
- **Frequência Semanal**: (treinos da semana / meta semanal) × 100

## 🛠️ **Stack Tecnológica .NET**

### **Backend (.NET 8):**
- **.NET 8** com **C# 12**
- **ASP.NET Core Web API**
- **Entity Framework Core** com **PostgreSQL**
- **JWT Bearer** para autenticação
- **BCrypt.Net** para hash de senhas
- **FluentValidation** para validação
- **AutoMapper** para mapeamento
- **MediatR** para CQRS
- **Serilog** para logging
- **Redis** para cache (opcional)

### **Pacotes NuGet Principais:**
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
<PackageReference Include="AutoMapper" Version="12.0.1" />
<PackageReference Include="MediatR" Version="12.2.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
```

### **Infraestrutura:**
- **Docker** para containerização
- **PostgreSQL** como banco principal
- **Redis** para cache e sessões
- **AWS S3** ou **Azure Blob** para upload de imagens
- **Docker Compose** para desenvolvimento local

## 📊 **Endpoints de Estatísticas**

### **Dashboard Stats:**
```json
{
  "totalWorkouts": 45,
  "thisWeekWorkouts": 3,
  "weeklyFrequency": 75,
  "averageDuration": 65,
  "activeGoals": 2,
  "goalsProgress": 68,
  "currentWeight": 75.5,
  "weightTrend": -1.2,
  "totalVolume": "125k"
}
```

### **Progress Charts:**
- Evolução do peso (3M, 6M, 1A)
- Frequência semanal
- Volume de treino
- Progresso das metas

## 🔄 **Fluxos Principais**

### **1. Criação de Treino:**
1. Usuário seleciona tipo de treino
2. Adiciona exercícios da biblioteca
3. Define séries, pesos e repetições
4. Inicia treino (start_time)
5. Completa treino (end_time, completed=true)

### **2. Acompanhamento de Progresso:**
1. Registra métricas corporais
2. Sistema calcula tendências
3. Atualiza progresso das metas
4. Gera estatísticas e gráficos

### **3. Gestão de Metas:**
1. Cria meta com valor alvo e prazo
2. Define marcos intermediários
3. Atualiza progresso manualmente
4. Sistema notifica conclusão

## 🚀 **Onde Começar - Plano de Implementação**

### **🎯 RECOMENDAÇÃO: Comece pela Autenticação**

**Por que começar pela autenticação?**
- É a base de segurança de toda aplicação
- Permite testar a arquitetura desde o início
- Outras funcionalidades dependem dela
- É relativamente simples de implementar

### **📋 Passo a Passo Detalhado:**

#### **Semana 1: Setup e Autenticação**
1. **Criar estrutura do projeto** (1 dia)
   ```bash
   dotnet new sln -n GymTrackerPro
   dotnet new classlib -n GymTrackerPro.Domain
   dotnet new classlib -n GymTrackerPro.Application
   dotnet new classlib -n GymTrackerPro.Infrastructure
   dotnet new webapi -n GymTrackerPro.API
   dotnet new xunit -n GymTrackerPro.Tests
   ```

2. **Configurar Entity Framework** (1 dia)
   - Instalar pacotes NuGet
   - Criar DbContext
   - Configurar conexão PostgreSQL

3. **Implementar autenticação** (3 dias)
   - Entidade User no Domain
   - JWT Service na Application
   - AuthController na API
   - Middleware de autenticação

#### **Semana 2: Exercícios (Base para Treinos)**
1. **CRUD de Exercícios** (3 dias)
   - Entidade Exercise
   - Repository e Service
   - Controller e DTOs
   - Validações

2. **Testes básicos** (2 dias)
   - Testes unitários
   - Testes de integração

#### **Semana 3-4: Sistema de Treinos (Core Feature)**
1. **Entidades de Treino** (2 dias)
2. **CRUD de Treinos** (3 dias)
3. **Exercícios do Treino** (3 dias)
4. **Séries e Repetições** (2 dias)

#### **Semana 5: Métricas e Dashboard**
1. **BodyMetrics** (2 dias)
2. **Dashboard stats** (3 dias)

### **🏗️ Estrutura de Arquivos Recomendada:**

```
GymTrackerPro.Domain/
├── Entities/
│   ├── User.cs
│   ├── Exercise.cs
│   ├── Workout.cs
│   └── BaseEntity.cs
├── ValueObjects/
│   ├── Email.cs
│   └── UserPreferences.cs
├── Enums/
│   ├── ExerciseType.cs
│   └── GoalCategory.cs
├── Interfaces/
│   ├── IUserRepository.cs
│   └── IWorkoutRepository.cs
└── Exceptions/
    └── DomainException.cs

GymTrackerPro.Application/
├── UseCases/
│   ├── Auth/
│   │   ├── LoginUseCase.cs
│   │   └── RegisterUseCase.cs
│   └── Workouts/
│       ├── CreateWorkoutUseCase.cs
│       └── GetWorkoutsUseCase.cs
├── DTOs/
│   ├── Auth/
│   │   ├── LoginRequest.cs
│   │   └── LoginResponse.cs
│   └── Workouts/
│       ├── CreateWorkoutRequest.cs
│       └── WorkoutResponse.cs
├── Interfaces/
│   ├── IAuthService.cs
│   └── IWorkoutService.cs
└── Validators/
    └── CreateWorkoutValidator.cs

GymTrackerPro.Infrastructure/
├── Data/
│   ├── GymTrackerDbContext.cs
│   └── Configurations/
│       ├── UserConfiguration.cs
│       └── WorkoutConfiguration.cs
├── Repositories/
│   ├── UserRepository.cs
│   └── WorkoutRepository.cs
├── Services/
│   ├── JwtService.cs
│   └── PasswordService.cs
└── Extensions/
    └── ServiceCollectionExtensions.cs

GymTrackerPro.API/
├── Controllers/
│   ├── AuthController.cs
│   └── WorkoutsController.cs
├── Middleware/
│   ├── ExceptionMiddleware.cs
│   └── AuthMiddleware.cs
├── Program.cs
└── appsettings.json
```

### **🔧 Exemplo de Implementação - AuthController:**

```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var command = new RegisterCommand(request.Name, request.Email, request.Password);
        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
            return Ok(result.Value);
            
        return BadRequest(result.Error);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var command = new LoginCommand(request.Email, request.Password);
        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
            return Ok(result.Value);
            
        return Unauthorized(result.Error);
    }
}
```

### **📊 Fases de Desenvolvimento:**

#### **Fase 1 - MVP (4-6 semanas):**
1. **Setup do projeto** (1 semana)
2. **Autenticação e usuários** (1 semana)
3. **CRUD de exercícios e treinos** (2 semanas)
4. **Métricas corporais básicas** (1 semana)
5. **Dashboard simples** (1 semana)

#### **Fase 2 - Funcionalidades Avançadas (3-4 semanas):**
1. **Sistema de metas completo**
2. **Gráficos e visualizações**
3. **Cálculos automáticos**
4. **Otimizações de performance**

#### **Fase 3 - Melhorias (2-3 semanas):**
1. **Upload de imagens**
2. **Notificações**
3. **Exportação de dados**
4. **Testes automatizados**

## 📈 **Análise de Impacto**

### **Escalabilidade:**
- **Arquitetura modular** permite crescimento horizontal
- **Cache Redis** para consultas frequentes
- **Índices de banco** otimizados para performance
- **Paginação** em todas as listagens

### **Manutenibilidade:**
- **TypeScript** garante type safety
- **Prisma ORM** facilita migrações
- **Validação centralizada** com Joi/Zod
- **Logs estruturados** para debugging

### **Segurança:**
- **JWT** com refresh tokens
- **Rate limiting** para prevenir abuso
- **Validação rigorosa** de inputs
- **CORS** configurado adequadamente
- **Hash de senhas** com bcrypt

### **Próximos Passos Sugeridos:**
1. **Implementar autenticação** como base
2. **Criar CRUD de exercícios** para popular dados
3. **Desenvolver sistema de treinos** (core feature)
4. **Adicionar métricas corporais** para tracking
5. **Implementar dashboard** com estatísticas
6. **Sistema de metas** para engajamento

## 📝 **Exemplos de Payloads**

### **Registro de Usuário:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### **Criação de Treino:**
```json
{
  "type": "Push",
  "duration": 75,
  "notes": "Treino forte hoje!",
  "exercises": [
    {
      "exerciseId": "uuid-do-exercicio",
      "sets": [
        {
          "reps": 12,
          "weight": 60,
          "rest": 90
        }
      ]
    }
  ]
}
```

### **Métricas Corporais:**
```json
{
  "date": "2024-01-15",
  "weight": 75.5,
  "bodyFat": 15.2,
  "measurements": {
    "chest": 95.0,
    "waist": 80.0,
    "bicep": 35.0
  }
}
```

### **Criação de Meta:**
```json
{
  "title": "Aumentar Força no Supino",
  "description": "Melhorar a força máxima no exercício de supino reto",
  "category": "strength",
  "targetValue": 100,
  "currentValue": 70,
  "unit": "kg",
  "deadline": "2024-06-15"
}
```

## 🚀 **Comandos para Começar Agora**

### **1. Criar a Solução:**
```bash
# Criar solução
dotnet new sln -n GymTrackerPro

# Criar projetos
dotnet new classlib -n GymTrackerPro.Domain
dotnet new classlib -n GymTrackerPro.Application  
dotnet new classlib -n GymTrackerPro.Infrastructure
dotnet new webapi -n GymTrackerPro.API
dotnet new xunit -n GymTrackerPro.Tests

# Adicionar projetos à solução
dotnet sln add GymTrackerPro.Domain/GymTrackerPro.Domain.csproj
dotnet sln add GymTrackerPro.Application/GymTrackerPro.Application.csproj
dotnet sln add GymTrackerPro.Infrastructure/GymTrackerPro.Infrastructure.csproj
dotnet sln add GymTrackerPro.API/GymTrackerPro.API.csproj
dotnet sln add GymTrackerPro.Tests/GymTrackerPro.Tests.csproj
```

### **2. Configurar Referências:**
```bash
# API referencia Application e Infrastructure
dotnet add GymTrackerPro.API/GymTrackerPro.API.csproj reference GymTrackerPro.Application/GymTrackerPro.Application.csproj
dotnet add GymTrackerPro.API/GymTrackerPro.API.csproj reference GymTrackerPro.Infrastructure/GymTrackerPro.Infrastructure.csproj

# Application referencia Domain
dotnet add GymTrackerPro.Application/GymTrackerPro.Application.csproj reference GymTrackerPro.Domain/GymTrackerPro.Domain.csproj

# Infrastructure referencia Domain e Application
dotnet add GymTrackerPro.Infrastructure/GymTrackerPro.Infrastructure.csproj reference GymTrackerPro.Domain/GymTrackerPro.Domain.csproj
dotnet add GymTrackerPro.Infrastructure/GymTrackerPro.Infrastructure.csproj reference GymTrackerPro.Application/GymTrackerPro.Application.csproj

# Tests referencia todos os projetos
dotnet add GymTrackerPro.Tests/GymTrackerPro.Tests.csproj reference GymTrackerPro.Domain/GymTrackerPro.Domain.csproj
dotnet add GymTrackerPro.Tests/GymTrackerPro.Tests.csproj reference GymTrackerPro.Application/GymTrackerPro.Application.csproj
dotnet add GymTrackerPro.Tests/GymTrackerPro.Tests.csproj reference GymTrackerPro.Infrastructure/GymTrackerPro.Infrastructure.csproj
```

### **3. Instalar Pacotes NuGet:**
```bash
# No projeto API
cd GymTrackerPro.API
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore
dotnet add package Serilog.AspNetCore

# No projeto Application
cd ../GymTrackerPro.Application
dotnet add package MediatR
dotnet add package FluentValidation
dotnet add package AutoMapper

# No projeto Infrastructure
cd ../GymTrackerPro.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package BCrypt.Net-Next
dotnet add package Microsoft.Extensions.Configuration
```

### **4. Primeiro Commit:**
```bash
git init
git add .
git commit -m "feat: initial project structure with clean architecture"
```

### **5. Próximos Passos Imediatos:**
1. **Criar entidade User** no Domain
2. **Configurar DbContext** no Infrastructure
3. **Implementar JWT Service** na Application
4. **Criar AuthController** na API
5. **Testar autenticação** com Postman/Swagger

---

## 📚 **Recursos Adicionais**

### **Documentação Oficial:**
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [MediatR](https://github.com/jbogard/MediatR)

### **Padrões Recomendados:**
- **CQRS** com MediatR para separar Commands e Queries
- **Repository Pattern** para abstração de dados
- **Unit of Work** para transações
- **Result Pattern** para tratamento de erros
- **FluentValidation** para validações

Esta documentação fornece uma base sólida para o desenvolvimento do backend em C# com Clean Architecture, mantendo consistência com o frontend existente e garantindo escalabilidade futura.
